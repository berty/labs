NAME=<name>
RN_ROOT=../..
BUNDLE_ROOT=$(RN_ROOT)/html-mods.bundle
BUILD_TARGET=$(BUNDLE_ROOT)/$(NAME)
INDEX_HTML=$(BUILD_TARGET)/index.html
NODE_MODULES=node_modules
DIST_DIR=build
SOURCES=$(shell find src public)

$(INDEX_HTML): $(NODE_MODULES) $(SOURCES) info.json
	@echo --- Build Module ---
	rm -fr $(DIST_DIR)
	npm run build

	@echo --- Install Module ---
	rm -fr $(BUILD_TARGET)
	mkdir -p $(BUNDLE_ROOT)
	cp -r $(DIST_DIR) $(BUILD_TARGET)
	cp info.json $(BUILD_TARGET)/info.json

$(NODE_MODULES): package.json
	npm install
	touch $@

dev: $(NODE_MODULES)
	npm start
.PHONY: dev