package labs

import (
	"berty.tech/labs/go/pkg/blmod"

	"berty.tech/labs/go/mod/datastorebench"
)

var modules = []blmod.ModuleFactory{
	datastorebench.New,
}
