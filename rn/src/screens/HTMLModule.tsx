import React from 'react'
import { Text } from 'react-native'
import { WebView } from 'react-native-webview'
import Hyperlink from 'react-native-hyperlink'

import { ScreenFC, useAppNavigation } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { AppScreenContainer, Card, LoaderScreen } from '@berty-labs/components'
import { useGomobileIPFS } from '@berty-labs/react-redux'

const space = 15

export const HTMLModule: ScreenFC<'HTMLModule'> = ({
	route: {
		params: { name, displayName, preamble },
	},
}) => {
	const nav = useAppNavigation()
	const mobileIPFS = useGomobileIPFS()
	const [localError, setLocalError] = React.useState<string>()

	React.useEffect(() => {
		nav.setOptions({ title: displayName || name })
	}, [nav, displayName, name])

	if (mobileIPFS.status !== 'up') {
		return <LoaderScreen text='Waiting for IPFS node...' />
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
			{!!preamble && (
				<Card style={{ marginBottom: space }}>
					<Hyperlink linkDefault={true}>
						<Text style={{ color: defaultColors.text }} selectable={true}>
							{preamble.trim()}
						</Text>
					</Hyperlink>
				</Card>
			)}
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
