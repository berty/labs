module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		'@babel/proposal-export-namespace-from',
		[
			'module-resolver',
			{
				alias: {
					'@berty-labs': './src/',
				},
			},
		],
	],
}
