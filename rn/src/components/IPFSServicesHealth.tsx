import React from 'react'
import { Text, ViewStyle } from 'react-native'

import { defaultColors } from '@berty-labs/styles'
import { prettyMilliSeconds, useMountEffect } from '@berty-labs/reactutil'
import { useGomobileIPFS } from '@berty-labs/ipfsutil'
import { PressableCard } from '@berty-labs/components'

type ServiceStatus =
	| {
			state: 'init' | 'querying'
			deadDetails?: undefined
			time?: undefined
	  }
	| {
			state: 'up'
			deadDetails?: undefined
			time: number
	  }
	| {
			state: 'dead'
			deadDetails?: string
			time: number
	  }

const textStyle = { color: defaultColors.white, opacity: 0.7 }

const stateString = (state: ServiceStatus) => {
	switch (state.state) {
		case 'init':
			return 'Tap to ping'
		case 'querying':
			return '🧐 Querying..'
		case 'up':
			return '💚 Responded in ' + prettyMilliSeconds(state.time || 0)
		case 'dead':
			return `☠ Dead after ${prettyMilliSeconds(state.time || 0)}${
				state.deadDetails ? `\n\n${state.deadDetails}` : ''
			}`
		default:
			return `Unknown:\n${JSON.stringify(state, null, 4)}`
	}
}

const PingCard: React.FC<{ style?: ViewStyle; name: string; address?: string }> = ({
	style,
	name,
	address,
}) => {
	const [state, setState] = React.useState<ServiceStatus>({
		state: 'init',
	})

	const refresh = React.useCallback(() => {
		const start = async () => {
			if (!address) {
				return
			}
			const startDate = Date.now()
			setState({
				state: 'querying',
			})
			try {
				const reply = await fetch(address)
				console.log(name, 'ping status:', reply.status)
				setState({
					state: 'up',
					time: Date.now() - startDate,
				})
			} catch (err: unknown) {
				console.log('ping error:', err)
				setState({
					state: 'dead',
					deadDetails: `${err}`,
					time: Date.now() - startDate,
				})
			}
		}
		start()
	}, [address, name])

	useMountEffect(refresh)

	return (
		<PressableCard style={style} title={name} onPress={refresh}>
			<Text style={[textStyle, { marginBottom: 15 }]}>Address: {address}</Text>
			<Text style={textStyle}>{stateString(state)}</Text>
		</PressableCard>
	)
}

export const IPFSServicesHealth: React.FC<{ style?: ViewStyle }> = ({ style }) => {
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
		<>
			{items.map(item => (
				<PingCard style={style} key={item.name} name={item.name} address={item.address} />
			))}
		</>
	)
}
