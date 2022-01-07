import React from 'react'
import { ImageStyle, SafeAreaView, ScrollView, ViewStyle } from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { View, Text, Image, useColorScheme, ActivityIndicator } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

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
		return `${ms / 60000}min`
	}
	if (ms >= 1000) {
		return `${ms / 1000}sec`
	}
	return `${ms}ms`
}

export const GatewaysRace: ScreenFC<'GatewaysRace'> = () => {
	const isDarkMode = useColorScheme() === 'dark'
	const init = React.useRef(Date.now())
	const [loadedLocal, setLoadedLocal] = React.useState<number>()
	const [loadedExiternal, setLoadedExternal] = React.useState<number>()
	const mobileIPFS = useGomobileIPFS()
	const textStyle = {
		color: isDarkMode ? Colors.white : Colors.black,
		fontSize: 18,
	}
	const [imageURI, setImageURI] = React.useState<string>()
	React.useEffect(() => {
		if (!mobileIPFS.gatewayURL) {
			return
		}
		let canceled = false
		const start = async () => {
			const url = mobileIPFS.gatewayURL + superlativeApe
			console.log('fetching:', url)
			const reply = await fetch(url)
			console.log('fetch:', reply.status)
			if (canceled) {
				console.log('fetch canceled')
				return
			}
			if (!(reply.status === 200)) {
				console.warn('fetch fail')
				return
			}
			setImageURI(url)
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
							This test loads a react-native Image from the embedded Gomobile-IPFS gateway and the
							Pinata gateway concurrently
						</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30 }}>
						<View style={{ width: '50%', alignItems: 'center' }}>
							<Text style={[textStyle, { marginBottom: 30 }]}>External gateway</Text>
							<Image
								style={style}
								source={{ uri: externalGatewayURL + superlativeApe }}
								onLoad={() => setLoadedExternal(Date.now())}
							/>
							{loadedExiternal && (
								<Text style={[textStyle, { marginTop: 15 }]}>
									{prettyMilliSeconds(loadedExiternal - init.current)}
								</Text>
							)}
						</View>
						<View style={{ width: '50%', alignItems: 'center' }}>
							<Text style={[textStyle, { marginBottom: 30 }]}>Embedded gateway</Text>
							{imageURI ? (
								<Image
									style={style}
									source={{ uri: imageURI }}
									onError={({ nativeEvent: { error } }) => console.warn(error)}
									onLoad={() => setLoadedLocal(Date.now())}
								/>
							) : (
								<View style={style}>
									<ActivityIndicator />
								</View>
							)}
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
