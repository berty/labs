import React from 'react'
import { Text, ViewStyle } from 'react-native'

import { defaultColors } from '@berty-labs/styles'
import { prettyMilliSeconds, useMountEffect } from '@berty-labs/reactutil'
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

const textStyle = { color: defaultColors.text, opacity: 0.7 }

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

export type PingOpts = {
	name: string
	address?: string
	opts?: Omit<Parameters<typeof fetch>[1], 'signal'>
	allowedStatuses?: number[]
}

const defaultAllowedStatuses = [200]

export const PingCard: React.FC<
	{
		style?: ViewStyle
	} & PingOpts
> = ({ style, name, address, opts, allowedStatuses = defaultAllowedStatuses }) => {
	const acRef = React.useRef<AbortController>()

	const [state, setState] = React.useState<ServiceStatus>({
		state: 'init',
	})

	const refresh = React.useCallback(() => {
		acRef.current?.abort()
		const ac = new AbortController()
		acRef.current = ac
		const start = async () => {
			if (!address) {
				return
			}
			const startDate = Date.now()
			if (ac.signal.aborted) {
				return
			}
			setState({
				state: 'querying',
			})
			try {
				const reply = await fetch(address, { ...opts, signal: ac.signal })
				if (ac.signal.aborted) {
					return
				}
				if (!allowedStatuses?.includes(reply.status)) {
					setState({
						state: 'dead',
						deadDetails: `Unexpected status: ${reply.status} ${reply.statusText}`,
						time: Date.now() - startDate,
					})
					return
				}
				setState({
					state: 'up',
					time: Date.now() - startDate,
				})
			} catch (err: unknown) {
				console.log('ping error:', err)
				if (ac.signal.aborted) {
					return
				}
				setState({
					state: 'dead',
					deadDetails: `${err}`,
					time: Date.now() - startDate,
				})
			}
		}
		start()
	}, [address, allowedStatuses, opts])

	useMountEffect(() => {
		refresh()
		return () => acRef.current?.abort()
	})

	return (
		<PressableCard style={style} title={name} onPress={refresh}>
			<Text style={[textStyle, { marginBottom: 16 }]}>{address}</Text>
			<Text style={textStyle}>{stateString(state)}</Text>
		</PressableCard>
	)
}
