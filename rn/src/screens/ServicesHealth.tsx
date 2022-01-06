import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { useMountEffect } from '@berty-labs/reactutil'
import { useGomobileIPFS } from '@berty-labs/ipfsutil'

type ServiceStatus =
	| {
			state: 'init' | 'querying' | 'up'
			deadDetails?: undefined
	  }
	| {
			state: 'dead'
			deadDetails?: string
	  }

const textStyle = { color: defaultColors.white }

const Ping: React.FC<{ name: string; address: string }> = ({ name, address }) => {
	const [state, setState] = React.useState<ServiceStatus>({
		state: 'init',
	})

	const stateStrings: { [key in ServiceStatus['state']]: string } = {
		init: 'Tap to ping',
		querying: '🧐 Querying..',
		up: '💚 Up',
		dead: `☠ Dead${state.deadDetails ? `\n\n${state.deadDetails}` : ''}`,
	}

	const refresh = () => {
		const start = async () => {
			setState({
				state: 'querying',
			})
			try {
				const reply = await fetch(address)
				console.log(name, 'ping status:', reply.status)
				setState({
					state: 'up',
				})
			} catch (err: unknown) {
				console.log('ping error:', err)
				setState({
					state: 'dead',
					deadDetails: `${err}`,
				})
			}
		}
		start()
	}

	useMountEffect(refresh)

	return (
		<TouchableOpacity
			style={{
				alignItems: 'flex-start',
				padding: 15,
				margin: 15,
				backgroundColor: '#00000030',
				borderRadius: 15,
			}}
			onPress={refresh}
		>
			<Text style={[textStyle, { fontSize: 20 }]}>{name}</Text>
			<Text style={[textStyle, { marginBottom: 15 }]}>Address: {address}</Text>
			<Text style={textStyle}>{stateStrings[state.state]}</Text>
		</TouchableOpacity>
	)
}

export const ServicesHealth: ScreenFC<'ServicesHealth'> = () => {
	const mobileIPFS = useGomobileIPFS()

	const items = [
		{
			name: 'Local IPFS Node API',
			address: mobileIPFS.apiURL,
		},
		{
			name: 'Local IPFS Gateway',
			address: mobileIPFS.gatewayURL,
		},
		/*{
			name: 'Dead example',
			address: "http://127.0.0.1:1234",
		},*/
	]

	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			<View style={{ padding: 15 }}>
				{items.map(item => (
					<Ping key={item.name} name={item.name} address={item.address || ''} />
				))}
			</View>
		</SafeAreaView>
	)
}
