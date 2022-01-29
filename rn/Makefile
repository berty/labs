## User variables

METRO_RN_PORT ?= 8081
IOS_RN_FLAGS ?=
IOS_DEVICE ?=
ANDROID_DEVICE ?=

gomobile-ipfs-src=gomobile-ipfs/packages/build/ios/cocoapods
gomobile-ipfs-dst=ios/vendored_pods

## Internal variables

kill-program-using-port = $(foreach port,$(1),$(eval pid ?= $(shell lsof -t -i :$(port))) $(if $(pid),$(shell kill $(pid)),))

### js

.link:
	cd react-native-gomobile-ipfs && yarn link
	yarn link react-native-gomobile-ipfs
	touch $@

.PHONY: unlink
unlink:
	yarn unlink react-native-gomobile-ipfs || true
	cd react-native-gomobile-ipfs && yarn unlink || true
	rm -f .link


node_modules/.fresh: yarn.lock package.json $(wildcard patches/%)
	$(MAKE) unlink
	yarn
	$(MAKE) .link
	touch $@

#### iOS

ios/vendor/bundle: ios/Gemfile ios/Gemfile.lock
	cd ios && bundle install
	touch $@

ios/vendored_pods/Gomobile-IPFS-Core.podspec: react-native-gomobile-ipfs/gomobile-ipfs.version
	mkdir -p ios/vendored_pods
	curl -Lo $@ 'https://github.com/ipfs-shipyard/gomobile-ipfs/releases/download/v${shell cat react-native-gomobile-ipfs/gomobile-ipfs.version}/Gomobile-IPFS-Core.podspec'

ios/vendored_pods/Gomobile-IPFS-Bridge.podspec: react-native-gomobile-ipfs/gomobile-ipfs.version
	mkdir -p ios/vendored_pods
	curl -Lo $@ 'https://github.com/ipfs-shipyard/gomobile-ipfs/releases/download/v${shell cat react-native-gomobile-ipfs/gomobile-ipfs.version}/Gomobile-IPFS-Bridge.podspec'

ios/Pods/.fresh: ios/Podfile ios/Podfile.lock node_modules/.fresh ios/vendor/bundle ios/vendored_pods/Gomobile-IPFS-Core.podspec ios/vendored_pods/Gomobile-IPFS-Bridge.podspec
	rm -fr ios/Pods
	perl -i -pe "s/s\.dependency 'Gomobile-IPFS-Bridge', '~> .+'/s\.dependency 'Gomobile-IPFS-Bridge', '~> ${shell cat react-native-gomobile-ipfs/gomobile-ipfs.version}'/" react-native-gomobile-ipfs/react-native-gomobile-ipfs.podspec
	cd ios && bundle exec pod update Gomobile-IPFS-Core Gomobile-IPFS-Bridge --no-repo-update
	cd ios && bundle exec pod install --repo-update
	touch $@

.PHONY: ios
ios: node_modules/.fresh ios/Pods/.fresh
	npx react-native run-ios \
		--port="$(METRO_RN_PORT)" \
		$(if $(IOS_DEVICE),--udid='$(IOS_DEVICE)',) \
		$(IOS_RN_FLAGS)

#### Android

.PHONY: android
android: node_modules/.fresh
	npx react-native run-android \
		--port="$(METRO_RN_PORT)"

#### Lint

.PHONY: lint
lint: node_modules/.fresh
	yarn lint
	npx tsc

.PHONY: lint.fix
lint.fix: node_modules/.fresh
	yarn lint --fix
	npx tsc

#### React-Native

.PHONY: metro.start
metro.start: node_modules/.fresh
	npx react-native start --port=$(METRO_RN_PORT)

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