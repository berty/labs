all:
	@echo You probably want to cd rn
.PHONY: all

clean.gen:
	for api in $$(ls api); do rm -fr \
		go/pkg/$${api}/$${api}_grpc.pb.go \
		go/pkg/$${api}/$${api}.pb.go \
		rn/src/api/$${api} \
	; done
	rm -f go/bind/labs/modules.go
	rm -f rn/src/api/index.ts
.PHONY: clean.gen

generate:
	$(MAKE) -C rn node_modules/.mkt
	buf generate api
	set -e; for api in $$(ls api); do \
		echo '/* eslint-disable no-dupe-class-members */' > rn/src/api/$${api}/v1/$${api}_pb_service.new.d.ts; \
		cat rn/src/api/$${api}/v1/$${api}_pb_service.d.ts >> rn/src/api/$${api}/v1/$${api}_pb_service.new.d.ts; \
		mv rn/src/api/$${api}/v1/$${api}_pb_service.new.d.ts rn/src/api/$${api}/v1/$${api}_pb_service.d.ts; \
		\
		echo '/* eslint-disable eslint-comments/no-unlimited-disable */' > rn/src/api/$${api}/v1/$${api}_pb.new.js; \
		cat rn/src/api/$${api}/v1/$${api}_pb.js >> rn/src/api/$${api}/v1/$${api}_pb.new.js; \
		mv rn/src/api/$${api}/v1/$${api}_pb.new.js rn/src/api/$${api}/v1/$${api}_pb.js; \
		\
		echo "export * from './$${api}_pb'" > rn/src/api/$${api}/v1/index.ts; \
		echo "export * from './$${api}_pb_service'" >> rn/src/api/$${api}/v1/index.ts; \
		\
		echo "export * as $${api} from './$${api}/v1'" >> rn/src/api/index.ts; \
	done
	$(MAKE) -C rn lint.fix
	cd rn && npx ts-node src/create-mod/gen-go-modules-list
.PHONY: generate

regen: clean.gen
	$(MAKE) generate
.PHONY: regen