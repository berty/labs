// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             (unknown)
// source: blmod/v1/blmod.proto

package blmod

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// LabsModulesServiceClient is the client API for LabsModulesService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type LabsModulesServiceClient interface {
	AllModules(ctx context.Context, in *AllModulesRequest, opts ...grpc.CallOption) (*AllModulesResponse, error)
	RunModule(ctx context.Context, in *RunModuleRequest, opts ...grpc.CallOption) (LabsModulesService_RunModuleClient, error)
}

type labsModulesServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewLabsModulesServiceClient(cc grpc.ClientConnInterface) LabsModulesServiceClient {
	return &labsModulesServiceClient{cc}
}

func (c *labsModulesServiceClient) AllModules(ctx context.Context, in *AllModulesRequest, opts ...grpc.CallOption) (*AllModulesResponse, error) {
	out := new(AllModulesResponse)
	err := c.cc.Invoke(ctx, "/blmod.v1.LabsModulesService/AllModules", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *labsModulesServiceClient) RunModule(ctx context.Context, in *RunModuleRequest, opts ...grpc.CallOption) (LabsModulesService_RunModuleClient, error) {
	stream, err := c.cc.NewStream(ctx, &LabsModulesService_ServiceDesc.Streams[0], "/blmod.v1.LabsModulesService/RunModule", opts...)
	if err != nil {
		return nil, err
	}
	x := &labsModulesServiceRunModuleClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type LabsModulesService_RunModuleClient interface {
	Recv() (*RunModuleResponse, error)
	grpc.ClientStream
}

type labsModulesServiceRunModuleClient struct {
	grpc.ClientStream
}

func (x *labsModulesServiceRunModuleClient) Recv() (*RunModuleResponse, error) {
	m := new(RunModuleResponse)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// LabsModulesServiceServer is the server API for LabsModulesService service.
// All implementations must embed UnimplementedLabsModulesServiceServer
// for forward compatibility
type LabsModulesServiceServer interface {
	AllModules(context.Context, *AllModulesRequest) (*AllModulesResponse, error)
	RunModule(*RunModuleRequest, LabsModulesService_RunModuleServer) error
	mustEmbedUnimplementedLabsModulesServiceServer()
}

// UnimplementedLabsModulesServiceServer must be embedded to have forward compatible implementations.
type UnimplementedLabsModulesServiceServer struct {
}

func (UnimplementedLabsModulesServiceServer) AllModules(context.Context, *AllModulesRequest) (*AllModulesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AllModules not implemented")
}
func (UnimplementedLabsModulesServiceServer) RunModule(*RunModuleRequest, LabsModulesService_RunModuleServer) error {
	return status.Errorf(codes.Unimplemented, "method RunModule not implemented")
}
func (UnimplementedLabsModulesServiceServer) mustEmbedUnimplementedLabsModulesServiceServer() {}

// UnsafeLabsModulesServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to LabsModulesServiceServer will
// result in compilation errors.
type UnsafeLabsModulesServiceServer interface {
	mustEmbedUnimplementedLabsModulesServiceServer()
}

func RegisterLabsModulesServiceServer(s grpc.ServiceRegistrar, srv LabsModulesServiceServer) {
	s.RegisterService(&LabsModulesService_ServiceDesc, srv)
}

func _LabsModulesService_AllModules_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AllModulesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(LabsModulesServiceServer).AllModules(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/blmod.v1.LabsModulesService/AllModules",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(LabsModulesServiceServer).AllModules(ctx, req.(*AllModulesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _LabsModulesService_RunModule_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(RunModuleRequest)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(LabsModulesServiceServer).RunModule(m, &labsModulesServiceRunModuleServer{stream})
}

type LabsModulesService_RunModuleServer interface {
	Send(*RunModuleResponse) error
	grpc.ServerStream
}

type labsModulesServiceRunModuleServer struct {
	grpc.ServerStream
}

func (x *labsModulesServiceRunModuleServer) Send(m *RunModuleResponse) error {
	return x.ServerStream.SendMsg(m)
}

// LabsModulesService_ServiceDesc is the grpc.ServiceDesc for LabsModulesService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var LabsModulesService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "blmod.v1.LabsModulesService",
	HandlerType: (*LabsModulesServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "AllModules",
			Handler:    _LabsModulesService_AllModules_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "RunModule",
			Handler:       _LabsModulesService_RunModule_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "blmod/v1/blmod.proto",
}