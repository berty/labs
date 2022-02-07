NAME=ipfs-upload-file
RN_ROOT=../..
BUNDLE_ROOT=$(RN_ROOT)/html-mods.bundle
BUILD_TARGET=$(BUNDLE_ROOT)/$(NAME)
INDEX_HTML=$(BUILD_TARGET)/index.html
REPO_ROOT=repo
NODE_MODULES_TARGET=$(REPO_ROOT)/node_modules/.mkt
REPO_TARGET=$(REPO_ROOT)/.mkt
DIST_DIR=$(REPO_ROOT)/dist

$(INDEX_HTML): $(REPO_TARGET) $(NODE_MODULES_TARGET) info.json
	rm -fr $(DIST_DIR)
	cd $(REPO_ROOT) && npm run build
	rm -fr $(BUILD_TARGET)
	cp -r $(DIST_DIR) $(BUILD_TARGET)
	cp info.json $(BUILD_TARGET)/info.json

$(REPO_TARGET): remote commit
	rm -fr $(REPO_ROOT)
	git clone $(shell cat remote) $(REPO_ROOT)
	cd $(REPO_ROOT) && git checkout $(shell cat commit)
	touch $@

$(NODE_MODULES_TARGET): $(REPO_TARGET) $(REPO_ROOT)/package.json
	cd $(REPO_ROOT) && npm install
	touch $@

dev: $(REPO_TARGET) $(NODE_MODULES_TARGET)
	cd $(REPO_ROOT) && npm start
.PHONY: dev