package datastorebench

import (
	"context"

	"berty.tech/labs/go/pkg/blmod"
)

type module struct {
	blmod.UnimplementedModule
}

var _ blmod.Module = (*module)(nil)

func New() (blmod.Module, error) {
	return &module{}, nil
}

var _ blmod.ModuleFactory = New

func (m *module) Info() (*blmod.ModuleInfo, error) {
	return &blmod.ModuleInfo{
		Name:             "datastorebench",
		DisplayName:      "Datastores Benchmark",
		IconKind:         blmod.ModuleInfo_ICON_KIND_UTF,
		IconData:         ([]byte)("🏬"),
		ShortDescription: "Benchmark datastore implementations",
	}, nil
}

func (m *module) Run(ctx context.Context) (*blmod.RunModuleResponse, error) {
	return &blmod.RunModuleResponse{
		ReportKind: blmod.RunModuleResponse_REPORT_KIND_UTF,
		ReportData: ([]byte)("Hello from Go module!"),
	}, nil
}
