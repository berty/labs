import React, { useState } from 'react'
import { Text, TextInputProps } from 'react-native'
import WebView from 'react-native-webview'

import { ScreenFC } from '@berty-labs/navigation'
import {
	AppScreenContainer,
	Card,
	Loader,
	LoaderScreen,
	TextInputCard,
} from '@berty-labs/components'
import { useGomobileIPFS } from '@berty-labs/react-redux'
import { defaultColors } from '@berty-labs/styles'

const space = 15

const URLInput: React.FC<
	Omit<TextInputProps, 'style'> & {
		onConfirm?: () => void
	}
> = props => {
	return (
		<TextInputCard
			placeholder='Enter address...'
			autoCapitalize='none'
			autoCorrect={false}
			textSize={20}
			{...props}
		/>
	)
}

const PageLoader = () => <LoaderScreen text='Rendering page...' />

export const Browser: ScreenFC<'Browser'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const [localError, setLocalError] = useState('')
	const [entryURI, setEntryURI] = useState('')
	const [loaded, setLoaded] = useState(false)
	const [uri, setURI] = useState('')
	const handleConfirm = React.useCallback(() => {
		setURI(entryURI)
	}, [entryURI])

	if (mobileIPFS.status !== 'up') {
		return <LoaderScreen text='Waiting for IPFS node...' />
	}

	return (
		<AppScreenContainer>
			<URLInput value={entryURI} onChangeText={setEntryURI} onConfirm={handleConfirm} />
			<Card title='Disclaimer' style={{ margin: space, marginTop: 0 }}>
				<Text style={{ color: defaultColors.text, opacity: 0.7 }}>
					This WebView requires polyfills for some Web APIs (namely crypto.web.subtle.digest on iOS)
				</Text>
			</Card>
			{!!loaded && !!localError && <Text style={{ color: defaultColors.text }}>{localError}</Text>}
			{!!uri && !loaded && (
				<Loader text='Loading page...' style={{ justifyContent: 'flex-start' }} />
			)}
			{!!uri && (
				<WebView
					style={{
						backgroundColor: defaultColors.background,
						display: loaded ? undefined : 'none',
					}}
					source={{ uri }}
					containerStyle={{ backgroundColor: defaultColors.background }}
					renderError={err => (
						<Text style={{ color: defaultColors.text }}>{JSON.stringify(err, null, 4)}</Text>
					)}
					onLoadEnd={() => setLoaded(true)}
					onLoadStart={() => {
						setLoaded(false)
					}}
					renderLoading={PageLoader}
					onHttpError={err => {
						setLocalError(JSON.stringify(err, null, 4))
					}}
					onError={evt => {
						setLocalError(JSON.stringify(evt.nativeEvent, null, 4))
					}}
					originWhitelist={['*']}
					javaScriptEnabled={true}
					forceDarkOn={true}
				/>
			)}
		</AppScreenContainer>
	)
}
