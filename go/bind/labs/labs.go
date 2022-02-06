package labs

import (
	"fmt"
	"net/http"
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
