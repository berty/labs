import React, { useState } from 'react'
import { Text } from 'react-native'
import WebView from 'react-native-webview'

import { ScreenFC } from '@berty-labs/navigation'
import {
	AppScreenContainer,
	Card,
	LoaderCard,
	LoaderScreen,
	PressableCard,
} from '@berty-labs/components'
import { useGomobileIPFS } from '@berty-labs/react-redux'
import { defaultColors } from '@berty-labs/styles'
import { useAsyncTransform } from '@berty-labs/reactutil'

const PageLoader = () => <LoaderScreen text='Rendering page...' />

/*
❯ ipfs resolve /ipns/en.wikipedia-on-ipfs.org
/ipfs/bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze
❯ date
Sun Feb 13 16:25:01 CET 2022
*/
const fallbackCID = '/ipfs/bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze'
const fallbackDate = 'Sun Feb 13 16:25:01 CET 2022'

const space = 15

const cardStyle = { marginTop: space, marginHorizontal: space }

// TODO
// - Read wv navigation
// - Allow to pin specific pages to read and distribute them without internet
// - Use global state
// - Store current page and use it as first url
// - Allow to go back
// - Allow to go up
// - Allow to bookmark pages ? since no search could be really painful

export const Wikipedia: ScreenFC<'Wikipedia'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const [localError, setLocalError] = useState('')
	const [loaded, setLoaded] = useState(false)
	const [showResolveError, setShowResolveError] = useState(false)
	const [resolvedCID, loadedCID, resolveErr] = useAsyncTransform(
		async (ac: AbortController) => {
			if (!mobileIPFS.apiURL) {
				return
			}
			setShowResolveError(true)
			const reply = await fetch(
				`${mobileIPFS.apiURL}/api/v0/resolve?arg=${encodeURIComponent(
					'/ipns/en.wikipedia-on-ipfs.org',
				)}`,
				{
					signal: ac.signal,
					method: 'POST',
				},
			)
			if (!reply.ok) {
				throw new Error(`Unexpected status: ${reply.status}\n${await reply.text()}`)
			}
			const text = await reply.text()
			console.log('resolved:', text)
			return text
		},
		[mobileIPFS.apiURL],
	)

	const cid = resolvedCID || fallbackCID

	if (mobileIPFS.status !== 'up') {
		return <LoaderScreen text='Waiting for IPFS node...' />
	}

	return (
		<AppScreenContainer>
			{showResolveError && !!resolveErr && (
				<PressableCard
					title='Failed to resolve IPN'
					style={cardStyle}
					onPress={() => setShowResolveError(false)}
				>
					<Text style={{ color: defaultColors.text }}>
						Using fallback from: {fallbackDate}
						{'\n\n'}Tap to hide{`\n\n${resolveErr}`}
					</Text>
				</PressableCard>
			)}
			{!!localError && (
				<Card style={cardStyle}>
					<Text style={{ color: defaultColors.text }}>{`${resolveErr}`}</Text>
				</Card>
			)}
			{!loadedCID && !resolveErr && (
				<LoaderCard style={cardStyle} text='Resolving content identifier...' />
			)}
			{!loaded && <LoaderCard style={cardStyle} text='Loading page...' />}

			<WebView
				style={{
					marginTop: space,
					backgroundColor: defaultColors.background,
					display: loaded ? undefined : 'none',
				}}
				source={{
					uri: mobileIPFS.gatewayURL + cid,
				}}
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
					setLocalError(`${err}`)
				}}
				onError={evt => {
					setLocalError(JSON.stringify(evt.nativeEvent, null, 4))
				}}
				originWhitelist={['*']}
				forceDarkOn={true}
				allowsBackForwardNavigationGestures={true}
			/>
		</AppScreenContainer>
	)
}
