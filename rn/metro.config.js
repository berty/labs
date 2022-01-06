/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
	},
}
