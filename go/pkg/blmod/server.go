package blmod

import (
	"context"

	"github.com/pkg/errors"
)

type Server struct {
	UnimplementedLabsModulesServiceServer

	reg *Registry
}

var _ LabsModulesServiceServer = (*Server)(nil)

func NewServer(factos []ModuleFactory) (*Server, error) {
	reg := NewRegistry()
	for _, fact := range factos {
		mod, err := fact()
		if err != nil {
			return nil, errors.Wrap(err, "instanciate module")
		}
		if err := reg.Register(mod); err != nil {
			return nil, errors.Wrap(err, "register module")
		}
	}
	return &Server{
		reg: reg,
	}, nil
}

func (s *Server) Close() error {
	return s.reg.Close()
}

func (s *Server) AllModules(ctx context.Context, req *AllModulesRequest) (*AllModulesResponse, error) {
	mods := s.reg.All()
	info := make([]*ModuleInfo, len(mods))
	for i, mod := range mods {
		inf, err := mod.Info()
		if err != nil {
			return nil, errors.Wrap(err, "get module info")
		}
		info[i] = inf
	}
	return &AllModulesResponse{Modules: info}, nil
}

func (s *Server) RunModule(ctx context.Context, req *RunModuleRequest) (*RunModuleResponse, error) {
	mod, err := s.reg.Get(req.GetName())
	if err != nil {
		return nil, errors.Wrap(err, "get module")
	}
	return mod.Run(ctx)
}
