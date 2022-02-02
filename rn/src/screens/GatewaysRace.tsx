import React from 'react'
import {
	ImageStyle,
	ScrollView,
	ViewStyle,
	View,
	Text,
	Image,
	ActivityIndicator,
} from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { useGomobileIPFS } from '@berty-labs/react-redux'
import { AppScreenContainer, LoaderScreen } from '@berty-labs/components'
import { prettyMilliSeconds, useAsyncEffect } from '@berty-labs/reactutil'

// const superlativeApesRoot = "/ipfs/QmbYCLEdnez33AnjigGAhM3ouNj8LMTXBwUqVLaLnUvBbU"
const superlativeApe = '/ipfs/QmQVS8VrY9FFpUWKitGhFzzx3xGixAd4frf1Czr7AQxeTc/1.png'
const externalGatewayURL = 'https://gateway.pinata.cloud'

const style: ViewStyle & ImageStyle = {
	width: '60%',
	aspectRatio: 1,
	alignItems: 'center',
	justifyContent: 'center',
}

const textStyle = {
	color: defaultColors.text,
	fontSize: 18,
}

export const GatewaysRace: ScreenFC<'GatewaysRace'> = () => {
	const init = React.useRef(Date.now())

	const mobileIPFS = useGomobileIPFS()
	const [loadedLocal, setLoadedLocal] = React.useState<number>()
	const [localError, setLocalError] = React.useState<Error>()
	const [imageURI, setImageURI] = React.useState<string>()

	const [loadedExternal, setLoadedExternal] = React.useState<number>()
	const [externalError, setExternalError] = React.useState<Error>()

	useAsyncEffect(
		async controller => {
			if (!mobileIPFS.gatewayURL) {
				return
			}
			const url = mobileIPFS.gatewayURL + superlativeApe
			try {
				console.log('pre-fetching:', url)
				const reply = await fetch(url, { signal: controller.signal })
				if (controller.signal.aborted) {
					throw new Error('abort')
				}
				if (!(reply.status === 200)) {
					setLoadedLocal(Date.now())
					setLocalError(new Error(`bad reply status: ${reply.status}`))
					console.warn(`pre-fetch: bad reply status: ${reply.status}: ${url}`)
					return
				}
				console.log('pre-fetched:', url)
				setImageURI(url)
			} catch (err: unknown) {
				if (controller.signal.aborted) {
					console.log('pre-fetch abort:', url)
					return
				}
				console.warn(`pre-fetch: ${err}: ${url}`)
				setLoadedLocal(Date.now())
				setLocalError(err instanceof Error ? err : new Error(`${err}`))
			}
		},
		[mobileIPFS.gatewayURL],
	)

	if (!mobileIPFS.gatewayURL) {
		return <LoaderScreen text='Waiting for IPFS node...' />
	}

	return (
		<AppScreenContainer>
			<ScrollView>
				<View style={{ marginVertical: 30 }}>
					<View style={{ alignItems: 'center', paddingHorizontal: 30 }}>
						<Text style={{ color: defaultColors.text, opacity: 0.7 }}>
							This loads a react-native Image from the embedded Gomobile-IPFS gateway and the Pinata
							gateway concurrently
						</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30 }}>
						<View style={{ width: '50%', alignItems: 'center' }}>
							<Text style={[textStyle, { marginBottom: 30 }]}>External gateway</Text>
							<Image
								style={[style, (!loadedExternal || externalError) && { position: 'absolute' }]}
								source={{ uri: externalGatewayURL + superlativeApe, cache: 'reload' }}
								onLoad={() => setLoadedExternal(Date.now())}
								onError={evt => {
									setLoadedExternal(Date.now())
									setExternalError(evt.nativeEvent.error)
								}}
							/>
							{externalError && <Text style={textStyle}>{`${externalError}`}</Text>}
							{loadedExternal ? (
								<Text style={[textStyle, { marginTop: 15 }]}>
									{prettyMilliSeconds(loadedExternal - init.current)}
								</Text>
							) : (
								<View style={style}>
									<ActivityIndicator />
								</View>
							)}
						</View>
						<View style={{ width: '50%', alignItems: 'center' }}>
							<Text style={[textStyle, { marginBottom: 30 }]}>Embedded gateway</Text>
							{imageURI ? (
								<Image
									style={[style, (!loadedLocal || localError) && { position: 'absolute' }]}
									source={{ uri: imageURI, cache: 'reload' }}
									onLoad={() => setLoadedLocal(Date.now())}
									onError={evt => {
										setLoadedLocal(Date.now())
										setLocalError(evt.nativeEvent.error)
									}}
								/>
							) : (
								<View style={style}>
									<ActivityIndicator />
								</View>
							)}
							{localError && <Text style={textStyle}>{`${localError}`}</Text>}
							{loadedLocal && (
								<Text style={[textStyle, { marginTop: 15 }]}>
									{prettyMilliSeconds(loadedLocal - init.current)}
								</Text>
							)}
						</View>
					</View>
				</View>
			</ScrollView>
		</AppScreenContainer>
	)
}
