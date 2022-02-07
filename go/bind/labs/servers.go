package labs

import (
	"berty.tech/labs/go/pkg/blmod"
	"berty.tech/labs/go/pkg/ipfsman"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

type serverDefinition struct {
	Name     string
	register func(s *grpc.Server, logger *zap.Logger) (func() error, error)
}

var servers = []*serverDefinition{
	{
		Name: "ipfsman",
		register: func(s *grpc.Server, logger *zap.Logger) (func() error, error) {
			ipfsmanServer, err := ipfsman.NewServer(logger)
			if err != nil {
				return nil, err
			}
			ipfsman.RegisterIPFSManagerServiceServer(s, ipfsmanServer)
			return ipfsmanServer.Close, nil
		},
	},
	{
		Name: "blmod",
		register: func(s *grpc.Server, logger *zap.Logger) (func() error, error) {
			blmodServer, err := blmod.NewServer(modules)
			if err != nil {
				return nil, err
			}
			blmod.RegisterLabsModulesServiceServer(s, blmodServer)
			return blmodServer.Close, nil
		},
	},
}
