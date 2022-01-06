import React from 'react'
import { ActivityIndicator, SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview'

import { useGomobileIPFS } from '@berty-labs/ipfsutil'
import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'

export const IPFSWebUI: ScreenFC<'IPFSWebUI'> = () => {
	const mobileIPFS = useGomobileIPFS()
	if (!mobileIPFS.gatewayURL) {
		return <ActivityIndicator />
	}
	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			<WebView
				style={{ backgroundColor: defaultColors.background }}
				source={{
					uri: `${mobileIPFS.gatewayURL}/ipfs/bafybeihcyruaeza7uyjd6ugicbcrqumejf6uf353e5etdkhotqffwtguva`,
				}}
			/>
		</SafeAreaView>
	)
}
