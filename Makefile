clean.gen:
	rm -fr \
		go/pkg/ipfsman/ipfsman_grpc.pb.go go/pkg/ipfsman/ipfsman.pb.go rn/src/api/ipfsman \
		go/pkg/blmod/blmod_grpc.pb.go go/pkg/blmod/blmod.pb.go rn/src/api/blmod 
.PHONY: clean-gen

generate:
	$(MAKE) -C rn node_modules/.fresh
	buf generate api
.PHONY: generate

regen: clean.gen
	$(MAKE) generate
.PHONY: regen