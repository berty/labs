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
	TextInputCard,
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

const ipn = '/ipns/en.wikipedia-on-ipfs.org'

type IPFSResolved = {
	Path?: string
}

export const Wikipedia: ScreenFC<'Wikipedia'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const [localError, setLocalError] = useState('')
	const [loaded, setLoaded] = useState(false)
	const [showResolveError, setShowResolveError] = useState(false)
	const [inputArticle, setInputArticle] = useState('')
	const [targetArticle, setTargetArticle] = useState('')
	const [freshCID, resolving, resolveErr] = useAsyncTransform(
		async (ac: AbortController) => {
			if (!mobileIPFS.apiURL) {
				return
			}
			setShowResolveError(true)
			const reply = await fetch(
				`${mobileIPFS.apiURL}/api/v0/resolve?arg=${encodeURIComponent(ipn)}`,
				{
					signal: ac.signal,
					method: 'POST',
				},
			)
			if (!reply.ok) {
				throw new Error(`Unexpected status: ${reply.status}\n${await reply.text()}`)
			}
			const r: IPFSResolved = await reply.json()
			console.log('resolved:', r)
			return r.Path
		},
		[mobileIPFS.apiURL],
	)

	const cid = freshCID || fallbackCID

	if (mobileIPFS.status !== 'up') {
		return <LoaderScreen text='Waiting for IPFS node...' />
	}

	return (
		<AppScreenContainer>
			<TextInputCard
				placeholder='Enter article name...'
				style={cardStyle}
				onChangeText={setInputArticle}
				onConfirm={() => setTargetArticle(inputArticle)}
			/>
			{showResolveError && !!resolveErr && (
				<PressableCard
					title='Failed to resolve IPN'
					style={cardStyle}
					onPress={() => setShowResolveError(false)}
				>
					<Text style={{ color: defaultColors.text }}>
						{ipn}
						{'\n\n'}Using fallback from: {fallbackDate}
						{'\n\n'}
						{fallbackCID}
						{'\n\n'}Tap to hide{`\n\n${resolveErr}`}
					</Text>
				</PressableCard>
			)}
			{!!localError && (
				<Card style={cardStyle}>
					<Text style={{ color: defaultColors.text }}>{`${resolveErr}`}</Text>
				</Card>
			)}
			{resolving && <LoaderCard style={cardStyle} text='Resolving content identifier...' />}
			{!loaded && <LoaderCard style={cardStyle} text='Loading page...' />}
			<WebView
				style={{
					marginTop: space,
					backgroundColor: defaultColors.background,
					display: loaded ? undefined : 'none',
				}}
				source={{
					uri: mobileIPFS.gatewayURL + cid + (targetArticle ? `/wiki/${targetArticle}` : ''),
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
