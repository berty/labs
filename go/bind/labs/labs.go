package labs

import (
	"fmt"
	"net"
	"net/http"
	"path/filepath"
	"sync"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_zap "github.com/grpc-ecosystem/go-grpc-middleware/logging/zap"
	grpc_ctxtags "github.com/grpc-ecosystem/go-grpc-middleware/tags"
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

	logger.Info("starting lab", zap.Any("config", config), zap.Any("modules-count", len(modules)))

	grpcLogger := logger.Named("grpc")
	grpc_zap.ReplaceGrpcLoggerV2(grpcLogger)

	htmlModules := config.HTMLModules
	htmlModsServerAddr := config.HTMLModulesAddr

	moduleMutex := new(sync.Mutex)
	module := ""
	staticSrv := http.Server{
		Addr: htmlModsServerAddr,
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
	logger.Info("started HTML modules server", zap.String("addr", htmlModsServerAddr))

	grpcServer := grpc.NewServer(
		grpc_middleware.WithUnaryServerChain(
			grpc_ctxtags.UnaryServerInterceptor(grpc_ctxtags.WithFieldExtractor(grpc_ctxtags.CodeGenRequestFieldExtractor)),
			grpc_zap.UnaryServerInterceptor(grpcLogger),
		),
		grpc_middleware.WithStreamServerChain(
			grpc_ctxtags.StreamServerInterceptor(grpc_ctxtags.WithFieldExtractor(grpc_ctxtags.CodeGenRequestFieldExtractor)),
			grpc_zap.StreamServerInterceptor(grpcLogger),
		),
	)
	cleaners := make([]func() error, len(servers))
	for i, def := range servers {
		clean, err := def.register(grpcServer, logger.Named(def.Name))
		if err != nil {
			return nil, errors.Wrap(err, fmt.Sprintf("start %s service", def.Name))
		}
		cleaners[len(servers)-(i+1)] = clean
	}
	logger.Info("registered grpc services", zap.Int("count", len(servers)), zap.Any("defs", servers))

	var closeGRPCWeb func() error
	if config.GRPCWebAddr != "" {
		logger.Info("using GRPCWeb server")
		wrappedGrpc := grpcweb.WrapServer(grpcServer, grpcweb.WithWebsockets(true))
		srv := http.Server{
			Addr:    config.GRPCWebAddr,
			Handler: http.HandlerFunc(wrappedGrpc.ServeHTTP),
		}
		closeGRPCWeb = srv.Close
		go func() {
			if err := srv.ListenAndServe(); err != nil {
				logger.Error("grpc server listener died", zap.Error(err))
			}
		}()
		logger.Info("GRPCWeb listening", zap.String("addr", config.GRPCWebAddr))
	}

	if config.GRPCAddr != "" {
		lis, err := net.Listen("tcp", config.GRPCAddr)
		if err != nil {
			panic(errors.Wrap(err, "grpc listen"))
		}
		go func() {
			if err := grpcServer.Serve(lis); err != nil {
				logger.Error("grpc server listener died", zap.Error(err))
			}
		}()
		logger.Info("GRPC listening", zap.String("addr", config.GRPCAddr))
	}

	lab := &Labs{
		logger: logger,
		mutex:  new(sync.Mutex),
		clean: func() error {
			grpcServer.GracefulStop()
			var err error
			if closeGRPCWeb != nil {
				err = multierr.Append(err, closeGRPCWeb())
			}
			for _, clean := range cleaners {
				err = multierr.Append(err, clean())
			}
			return err
		},
	}
	logger.Info("lab started")
	return lab, nil
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
