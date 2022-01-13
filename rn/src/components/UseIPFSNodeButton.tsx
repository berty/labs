import React from 'react'
import { ViewStyle } from 'react-native'

import { startIPFSNode } from '@berty-labs/redux'
import { useAppDispatch, useGomobileIPFS } from '@berty-labs/react-redux'

import { Button } from './Button'

export const UseIPFSNodeButton: React.FC<{
	nodeName: string
	style?: ViewStyle
	onUse?: () => void
}> = ({ nodeName, style, onUse }) => {
	const dispatch = useAppDispatch()
	const mobileIPFS = useGomobileIPFS()
	const isInUse = mobileIPFS.nodeName === nodeName
	const isNext = mobileIPFS.nextNodeName === nodeName
	const isUnloading = isInUse && mobileIPFS.status === 'unloading'
	const isLoading = isNext && mobileIPFS.status === 'loading'
	const isWaiting = isNext && mobileIPFS.status === 'unloading'
	return (
		<Button
			disabled={isInUse || mobileIPFS.status !== 'up'}
			title={
				isInUse
					? isUnloading
						? 'Stopping'
						: 'In use'
					: isLoading
					? 'Starting'
					: isWaiting
					? 'Waiting'
					: 'Use'
			}
			shrink
			style={style}
			onPress={() => {
				if (typeof onUse === 'function') {
					onUse()
				}
				dispatch(startIPFSNode(nodeName))
			}}
		/>
	)
}
