package labs

import (
	"fmt"
	"net/http"
	"path/filepath"
	"sync"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
	"go.uber.org/multierr"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

type Labs struct {
	logger *zap.Logger
	clean  func() error
	closed bool
	mutex  *sync.Mutex
}

func NewLabs(config *Config) (*Labs, error) {
	logger, err := zap.NewDevelopment()
	if err != nil {
		logger = zap.NewNop()
	}
	logger = logger.Named("labs")

	htmlModules := config.HTMLModules

	moduleMutex := new(sync.Mutex)
	module := ""
	staticSrv := http.Server{
		Addr: "127.0.0.1:9316",
		Handler: http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
			moduleName := r.Header.Get("X-Labs-Module")
			moduleMutex.Lock()
			if moduleName == "" && module == "" {
				rw.WriteHeader(422)
				moduleMutex.Unlock()
				return
			}
			if moduleName != "" {
				module = moduleName
			}
			moduleName = module
			moduleMutex.Unlock()
			rw.Header().Set("X-Labs-Module", moduleName)
			http.FileServer(http.Dir(filepath.Join(htmlModules, moduleName))).ServeHTTP(rw, r)
		}),
	}

	go func() {
		if err := staticSrv.ListenAndServe(); err != nil {
			logger.Error("grpc server listener died", zap.Error(err))
		}
	}()

	grpcServer := grpc.NewServer()
	cleaners := make([]func() error, len(servers))
	for i, def := range servers {
		clean, err := def.register(grpcServer, logger.Named(def.name))
		if err != nil {
			return nil, errors.Wrap(err, fmt.Sprintf("start %s service", def.name))
		}
		cleaners[len(servers)-(i+1)] = clean
	}

	wrappedGrpc := grpcweb.WrapServer(grpcServer, grpcweb.WithWebsockets(true))
	http.HandleFunc("/", wrappedGrpc.ServeHTTP)
	go func() {
		if err := http.ListenAndServe(config.Address, nil); err != nil {
			logger.Error("grpc server listener died", zap.Error(err))
		}
	}()

	clean := func() error {
		grpcServer.GracefulStop()
		var err error
		for _, clean := range cleaners {
			err = multierr.Append(err, clean())
		}
		return err
	}

	return &Labs{
		logger: logger,
		clean:  clean,
		mutex:  new(sync.Mutex),
	}, nil
}

func (b *Labs) Close() error {
	if b == nil {
		return nil
	}
	b.mutex.Lock()
	defer b.mutex.Unlock()
	if !b.closed {
		b.closed = true
		err := b.clean()
		if err != nil {
			return err
		}
	}
	return nil
}

func safeLogger(l *zap.Logger) *zap.Logger {
	if l == nil {
		l = zap.NewNop()
	}
	return l
}
