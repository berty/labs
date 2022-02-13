package blmod

import (
	"context"
	"encoding/json"

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

type moduleContext struct {
	srv LabsModulesService_RunModuleServer
}

var _ ModuleContext = (*moduleContext)(nil)

func (mc *moduleContext) Send(v interface{}) error {
	bytes, err := json.Marshal(v)
	if err != nil {
		return errors.Wrap(err, "marshal JSON")
	}
	return mc.srv.Send(&RunModuleResponse{Payload: bytes})
}

func (mc *moduleContext) Recv(v interface{}) error {
	reply, err := mc.srv.Recv()
	if err != nil {
		return err
	}
	if err := json.Unmarshal(reply.GetPayload(), v); err != nil {
		return errors.Wrap(err, "unmarshal JSON")
	}
	return nil
}

func (s *Server) RunModule(srv LabsModulesService_RunModuleServer) error {
	req, err := srv.Recv()
	if err != nil {
		return errors.Wrap(err, "read header")
	}
	mod, err := s.reg.Get(req.GetName())
	if err != nil {
		return errors.Wrap(err, "get module")
	}
	return mod.Run(srv.Context(), req.GetArgs(), &moduleContext{srv})
}

func (s *Server) Close() error {
	return s.reg.Close()
}
