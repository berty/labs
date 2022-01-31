package labs

import (
	"berty.tech/labs/go/mod/datastorebench"
	"berty.tech/labs/go/pkg/blmod"
)

var modules = []blmod.ModuleFactory{
	datastorebench.New,
}
