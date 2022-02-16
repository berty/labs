package blmod

import (
	"context"
	"io"
	"sync"

	"github.com/pkg/errors"
	"go.uber.org/multierr"
)

type ModuleContext interface {
	Send(interface{}) error
}

type Module interface {
	Info() (*ModuleInfo, error)
	Run(ctx context.Context, args []byte, mc ModuleContext) error
	Close() error
}

type ModuleResult struct {
	Name     string
	MimeType string
	Reader   io.Reader
}

type Registry struct {
	mods       []Module
	modsByName map[string]Module
	mu         *sync.Mutex
}

type ModuleFactory = func() (Module, error)

var (
	ErrNilRegistry       = errors.New("nil Registry")
	ErrNilModule         = errors.New("nil Module")
	ErrNotFound          = errors.New("not found")
	ErrAlreadyRegistered = errors.New("already registered")
	ErrNotImplemented    = errors.New("not implemented")
)

func NewRegistry() *Registry {
	return &Registry{
		mods:       []Module{},
		modsByName: make(map[string]Module),
		mu:         new(sync.Mutex),
	}
}

func (reg *Registry) All() []Module {
	if reg == nil {
		return nil
	}

	reg.mu.Lock()
	defer reg.mu.Unlock()

	dst := make([]Module, len(reg.mods))
	copy(dst, reg.mods)
	return dst
}

func (reg *Registry) Get(name string) (Module, error) {
	if reg == nil {
		return nil, ErrNilRegistry
	}

	reg.mu.Lock()
	defer reg.mu.Unlock()

	mod, ok := reg.modsByName[name]
	if !ok {
		return nil, ErrNotFound
	}
	return mod, nil
}

func (reg *Registry) Register(mod Module) error {
	if reg == nil {
		return ErrNilRegistry
	}
	if mod == nil {
		return ErrNilModule
	}

	reg.mu.Lock()
	defer reg.mu.Unlock()

	info, err := mod.Info()
	if err != nil {
		return errors.Wrap(err, "can't get module info")
	}
	if _, ok := reg.modsByName[info.GetName()]; ok {
		return ErrAlreadyRegistered
	}
	reg.mods = append(reg.mods, mod)
	reg.modsByName[info.GetName()] = mod
	return nil
}

func (reg *Registry) Close() error {
	if reg == nil {
		return nil
	}

	reg.mu.Lock()
	defer reg.mu.Unlock()

	var err error
	for _, mod := range reg.mods {
		err = multierr.Append(err, mod.Close())
	}
	reg.mods = []Module{}
	reg.modsByName = make(map[string]Module)
	return err
}

type UnimplementedModule struct {
}

var _ Module = (*UnimplementedModule)(nil)

func (um *UnimplementedModule) Info() (*ModuleInfo, error) {
	return nil, ErrNotImplemented
}

func (um *UnimplementedModule) Run(ctx context.Context, args []byte, mc ModuleContext) error {
	return ErrNotImplemented
}

func (um *UnimplementedModule) Close() error {
	return nil
}
