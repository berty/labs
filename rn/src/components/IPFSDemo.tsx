import React from 'react'
import { View, Text, Image, useColorScheme, ActivityIndicator } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

import { useGomobileIPFS } from '@berty-labs/ipfsutil'

// const superlativeApesRoot = "/ipfs/QmbYCLEdnez33AnjigGAhM3ouNj8LMTXBwUqVLaLnUvBbU"
const superlativeApe = '/ipfs/QmQVS8VrY9FFpUWKitGhFzzx3xGixAd4frf1Czr7AQxeTc/1.png'
const externalGatewayURL = 'https://gateway.pinata.cloud'

const style = { width: 42, height: 42 }

export const IPFSDemo: React.FC = () => {
	const isDarkMode = useColorScheme() === 'dark'
	const mobileIPFS = useGomobileIPFS('ipfs-repos/default-5')
	const textStyle = {
		color: isDarkMode ? Colors.white : Colors.black,
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
		<View style={{ flexDirection: 'row' }}>
			<View>
				<Text style={textStyle}>External gateway:</Text>
				<Image style={style} source={{ uri: externalGatewayURL + superlativeApe }} />
			</View>
			<View>
				<Text style={textStyle}>Gomobile gateway:</Text>
				{imageURI ? (
					<Image
						style={style}
						source={{ uri: imageURI }}
						onError={({ nativeEvent: { error } }) => console.warn(error)}
						onLoad={() => console.log('local image loaded')}
					/>
				) : (
					<ActivityIndicator />
				)}
			</View>
		</View>
	)
}
