import React from 'react'
import {
	ImageStyle,
	SafeAreaView,
	ScrollView,
	ViewStyle,
	View,
	Text,
	Image,
	ActivityIndicator,
} from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { useGomobileIPFS } from '@berty-labs/ipfsutil'

// const superlativeApesRoot = "/ipfs/QmbYCLEdnez33AnjigGAhM3ouNj8LMTXBwUqVLaLnUvBbU"
const superlativeApe = '/ipfs/QmQVS8VrY9FFpUWKitGhFzzx3xGixAd4frf1Czr7AQxeTc/1.png'
const externalGatewayURL = 'https://gateway.pinata.cloud'

const style: ViewStyle & ImageStyle = {
	width: '60%',
	aspectRatio: 1,
	alignItems: 'center',
	justifyContent: 'center',
}

const prettyMilliSeconds = (ms: number) => {
	if (ms >= 60000) {
		return `${(ms / 60000).toFixed(0)}min ${((ms % 60000) / 1000).toFixed(0)}sec`
	}
	if (ms >= 1000) {
		return `${(ms / 1000).toFixed(2)}sec`
	}
	return `${ms}ms`
}

const textStyle = {
	color: defaultColors.white,
	fontSize: 18,
}

export const GatewaysRace: ScreenFC<'GatewaysRace'> = () => {
	const init = React.useRef(Date.now())

	const [loadedLocal, setLoadedLocal] = React.useState<number>()
	const [localError, setLocalError] = React.useState<Error>()

	const [loadedExternal, setLoadedExternal] = React.useState<number>()
	const [externalError, setExternalError] = React.useState<Error>()

	const mobileIPFS = useGomobileIPFS()
	const [imageURI, setImageURI] = React.useState<string>()
	React.useEffect(() => {
		if (!mobileIPFS.gatewayURL) {
			return
		}
		let canceled = false
		const start = async () => {
			const url = mobileIPFS.gatewayURL + superlativeApe
			try {
				console.log('pre-fetching:', url)
				const reply = await fetch(url)
				if (canceled) {
					console.log('pre-fetch canceled:', url)
					return
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
				console.warn(`pre-fetch: ${err}: ${url}`)
				setLoadedLocal(Date.now())
				setLocalError(err instanceof Error ? err : new Error(`${err}`))
			}
		}
		start()
		return () => {
			canceled = true
		}
	}, [mobileIPFS.gatewayURL])

	if (mobileIPFS.state !== 'up') {
		return <Text style={textStyle}>IPFS: {mobileIPFS.state}</Text>
	}

	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			<ScrollView>
				<View style={{ marginVertical: 30 }}>
					<View style={{ alignItems: 'center', paddingHorizontal: 30 }}>
						<Text style={{ color: defaultColors.white, opacity: 0.7 }}>
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
		</SafeAreaView>
	)
}
