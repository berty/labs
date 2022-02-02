import React from 'react'
import { Text } from 'react-native'
import { WebView } from 'react-native-webview'

import { ScreenFC, useAppNavigation } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { AppScreenContainer, LoaderScreen } from '@berty-labs/components'
import { useGomobileIPFS } from '@berty-labs/react-redux'

export const HTMLModule: ScreenFC<'HTMLModule'> = ({
	route: {
		params: { name, displayName },
	},
}) => {
	const nav = useAppNavigation()
	const mobileIPFS = useGomobileIPFS()
	const [localError, setLocalError] = React.useState<string>()

	React.useEffect(() => {
		if (!displayName) {
			return
		}
		nav.setOptions({ title: displayName })
	}, [nav, displayName])

	if (mobileIPFS.status !== 'up') {
		return <LoaderScreen text='Waitinng for IPFS node...' />
	}
	if (localError) {
		return (
			<AppScreenContainer>
				<Text style={{ color: defaultColors.text }}>{`${localError}`}</Text>
			</AppScreenContainer>
		)
	}
	return (
		<AppScreenContainer>
			<WebView
				style={{ backgroundColor: defaultColors.background }}
				source={{
					uri: 'http://127.0.0.1:9316/#__labs_module__' + name, // we need to change the uri otherwise the page doesn't reload
					headers: { 'X-Labs-Module': name },
				}}
				cacheEnabled={false}
				containerStyle={{ backgroundColor: defaultColors.background }}
				onError={evt => {
					setLocalError(JSON.stringify(evt.nativeEvent, null, 4))
				}}
				originWhitelist={['*']}
			/>
		</AppScreenContainer>
	)
}
