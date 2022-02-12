NAME=<name>
RN_ROOT=../..
BUNDLE_ROOT=$(RN_ROOT)/html-mods.bundle
BUILD_TARGET=$(BUNDLE_ROOT)/$(NAME)
DIST_DIR=public

.PHONY: build
build: $(REPO_TARGET)
	@echo --- Install Module ---
	rm -fr $(BUILD_TARGET)
	mkdir -p $(BUNDLE_ROOT)
	cp -r $(DIST_DIR) $(BUILD_TARGET)
	cp info.json $(BUILD_TARGET)/info.json

.PHONY: dev
dev: $(NODE_MODULES_TARGET)
	@echo --- Start dev mode ---
	cd $(REPO_ROOT) && <devCommand>