/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const blacklist = require('metro-config/src/defaults/exclusionList')
const path = require('path')

const ignoreTopLevelFolders = [
	'ios',
	'html-mods.bundle',
	'html-mods',
	'node_modules/@types/node',
	// add more top level folders here
].map(f => new RegExp(`${path.resolve(f)}/.*`))

const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts

module.exports = {
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: true,
			},
		}),
		babelTransformerPath: require.resolve('react-native-svg-transformer'),
	},
	resolver: {
		assetExts: defaultAssetExts.filter(ext => ext !== 'svg'),
		sourceExts: [...defaultSourceExts, 'svg'],
		blacklistRE: blacklist(ignoreTopLevelFolders),
	},
}
