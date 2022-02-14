## User variables

METRO_RN_PORT ?= 8081
IOS_RN_FLAGS ?=
IOS_DEVICE ?=
ANDROID_DEVICE ?=
CI ?= false
CORE_PACKAGE = berty.tech/labs/go/bind/labs
IOS_CORE = react-native-labs-bridge/ios/Labs.xcframework
GO ?= go

gomobile-ipfs-src=gomobile-ipfs/packages/build/ios/cocoapods
gomobile-ipfs-dst=ios/vendored_pods

## Internal variables

kill-program-using-port = $(foreach port,$(1),$(eval pid ?= $(shell lsof -t -i :$(port))) $(if $(pid),$(shell kill $(pid)),))

all: ios
.PHONY: all

### html mods

html-mods=$(wildcard html-mods/*)

html-mods.all:
	mkdir -p html-mods.bundle
	@for mod in $(html-mods); do echo "--- Making HTML module $$(basename $$mod) ---"; SKIP_PREFLIGHT_CHECK=true make -C $$mod; done
	@echo --- Done making HTML modules ---
.PHONY: html-mods.all

### js

.PHONY: ios
ios: node_modules/.mkt ios/Pods/.mkt html-mods.all
	npx react-native run-ios \
	--port="$(METRO_RN_PORT)" \
	$(if $(IOS_DEVICE),--udid='$(IOS_DEVICE)',) \
	$(IOS_RN_FLAGS)

$(IOS_CORE): ../go.mod ../go.sum $(shell find ../go -name '*.go')
	$(GO) run golang.org/x/mobile/cmd/gomobile init -v
	CGO_CPPFLAGS=-DHAVE_GETHOSTUUID=0 $(GO) run golang.org/x/mobile/cmd/gomobile bind \
		$(GOMOBILE_OPT) \
		-v \
		-target=ios \
		-o $(IOS_CORE) \
		-cache "$(PWD)/ios/.gomobile-cache/labs" \
		$(CORE_PACKAGE)

.link:
	cd react-native-labs-bridge && yarn link
	yarn link react-native-labs-bridge
	touch $@

.PHONY: unlink
unlink:
	yarn unlink react-native-labs-bridge || true
	cd react-native-labs-bridge && yarn unlink || true
	rm -f .link

node_modules/.mkt: yarn.lock package.json $(wildcard patches/*)
	$(MAKE) unlink
	yarn $(if $(filter $(CI), true), --frozen-lockfile)
	$(MAKE) .link
	touch $@

#### iOS

ios/vendor/bundle: ios/Gemfile ios/Gemfile.lock
	cd ios && bundle install
	touch $@

ios/Pods/.mkt: $(IOS_CORE) ios/Podfile ios/Podfile.lock node_modules/.mkt ios/vendor/bundle
	cd ios && bundle exec pod install --repo-update
	touch $@

#### Android

.PHONY: android
android: node_modules/.mkt
	npx react-native run-android \
		--port="$(METRO_RN_PORT)"

#### Lint

.PHONY: lint
lint: node_modules/.mkt
	yarn lint
	npx tsc

.PHONY: lint.fix
lint.fix: node_modules/.mkt
	yarn lint --fix
	npx tsc

#### React-Native

.PHONY: metro.start
metro.start: node_modules/.mkt
	npx react-native start --port=$(METRO_RN_PORT)


.PHONY: create-module
create-module: node_modules/.mkt
	SKIP_PREFLIGHT_CHECK=true npx ts-node -TH --files ./src/create-mod

.PHONY: clean
clean:
	$(MAKE) unlink

	# React-native cmd
	yarn cache clean -f
	$(call kill-program-using-port, $(METRO_RN_PORT))

	# Android cmd
	cd android && ./gradlew clean || true

	# iOS cmd
ifneq (, $(shell which xcodebuild))
	cd ios && xcodebuild clean || true
endif


	# React-native files
	rm -rf node_modules
	rm -rf /tmp/react-native-packager-cache-*
	rm -rf /tmp/metro-bundler-cache-*

	# iOS files
	rm -rf ios/Pods

	# Android files
	rm -rf android/.gradle
	rm -rf android/build
	rm -rf android/app/build

	# Help complementary cleaning
	@echo ""
	@echo "Cleaned. Now you may consider clearing some of your system cache with one of the following commands."
	@echo ""
	@echo "  rm -rf $(HOME)/.gradle/caches"
	@echo "  rm -rf $(HOME)/Library/Developer/Xcode/DerivedData"
	@echo "  rm -rf $(HOME)/Library/Caches/CocoaPods"

	rm -fr gomobile-ipfs