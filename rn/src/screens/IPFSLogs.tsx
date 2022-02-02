import React from 'react'
import { Text } from 'react-native'
import WebView from 'react-native-webview'

import { ScreenFC } from '@berty-labs/navigation'
import { AppScreenContainer, LoaderScreen } from '@berty-labs/components'
import { useGomobileIPFS } from '@berty-labs/react-redux'
import { defaultColors } from '@berty-labs/styles'

export const IPFSLogs: ScreenFC<'IPFSLogs'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const [localError, setLocalError] = React.useState<string>()
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
			<WebView
				style={{ backgroundColor: defaultColors.background }}
				source={{
					uri: `${mobileIPFS.apiURL}/api/v0/log/tail`,
					method: 'POST',
				}}
				containerStyle={{ backgroundColor: defaultColors.background }}
				onError={evt => {
					setLocalError(JSON.stringify(evt.nativeEvent, null, 4))
				}}
			/>
		</AppScreenContainer>
	)
}
