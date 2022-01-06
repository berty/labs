import React from 'react'
import { Button, SafeAreaView, Text, View } from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { useMountEffect } from '@berty-labs/reactutil'

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
		querying: 'Querrying..',
		up: 'Up',
		dead: `Dead${state.deadDetails ? `: ${state.deadDetails}` : ''}`,
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
		<View>
			<Button title={`Ping ${name}`} onPress={refresh} />
			<Text style={textStyle}>Address: {address}</Text>
			<Text style={textStyle}>State: {stateStrings[state.state]}</Text>
		</View>
	)
}

const items = [
	{
		name: 'API',
		address: 'http://127.0.0.1:5001',
	},
	{
		name: 'Gateway',
		address: 'http://127.0.0.1:4242',
	},
	{
		name: 'WebUI',
		address: 'http://127.0.0.1:4243',
	},
]

export const ServicesHealth: ScreenFC<'ServicesHealth'> = () => {
	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			<View style={{ padding: 30 }}>
				{items.map(item => (
					<Ping key={item.name} name={item.name} address={item.address} />
				))}
			</View>
		</SafeAreaView>
	)
}
