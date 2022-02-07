NAME=react-typescript
RN_ROOT=../..
BUNDLE_ROOT=$(RN_ROOT)/html-mods.bundle
BUILD_TARGET=$(BUNDLE_ROOT)/$(NAME)
INDEX_HTML=$(BUILD_TARGET)/index.html
NODE_MODULES_TARGET=node_modules/.mkt
DIST_DIR=build
SOURCES=$(shell find src public)

$(INDEX_HTML): $(NODE_MODULES_TARGET) $(SOURCES) info.json
	rm -fr $(DIST_DIR)
	npm run build
	rm -fr $(BUILD_TARGET)
	cp -r $(DIST_DIR) $(BUILD_TARGET)
	cp info.json $(BUILD_TARGET)/info.json

$(NODE_MODULES_TARGET): package.json
	npm install
	touch $@

dev: $(NODE_MODULES_TARGET)
	npm start
.PHONY: dev