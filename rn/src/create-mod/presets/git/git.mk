NAME=<name>
RN_ROOT=../..
BUNDLE_ROOT=$(RN_ROOT)/html-mods.bundle
BUILD_TARGET=$(BUNDLE_ROOT)/$(NAME)
REPO_ROOT=<repoDir>
DIST_DIR=$(REPO_ROOT)/<distDir>

.PHONY: build
build: $(REPO_ROOT)
	@echo --- Build Module ---
	rm -fr $(DIST_DIR)
	cd $(REPO_ROOT) && <buildCommand>
	
	@echo --- Install Module ---
	rm -fr $(BUILD_TARGET)
	mkdir -p $(BUNDLE_ROOT)
	cp -r $(DIST_DIR) $(BUILD_TARGET)
	cp info.json $(BUILD_TARGET)/info.json

$(REPO_ROOT): remote commit
	@echo --- Clone repository ---
	rm -fr $(REPO_ROOT)
	git clone $(shell cat remote) $(REPO_ROOT)
	cd $(REPO_ROOT) && git checkout $(shell cat commit)
	touch $@

.PHONY: dev
dev: $(REPO_ROOT) $(NODE_MODULES_TARGET)
	@echo --- Start dev mode ---
	cd $(REPO_ROOT) && <devCommand>