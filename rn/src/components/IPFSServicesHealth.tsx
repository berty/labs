import React from 'react'
import { ViewStyle } from 'react-native'

import { useGomobileIPFS } from '@berty-labs/react-redux'

import { PingCard } from './PingCard'

const apiOpts = {
	method: 'POST',
}

export const IPFSAPIHealthCard: React.FC<{ style?: ViewStyle }> = React.memo(({ style }) => {
	const mobileIPFS = useGomobileIPFS()
	return (
		<PingCard
			style={style}
			name='Local IPFS Node API'
			address={mobileIPFS.apiURL + '/api/v0/id'}
			opts={apiOpts}
		/>
	)
})

export const IPFSGatewayHealthCard: React.FC<{ style?: ViewStyle }> = React.memo(({ style }) => {
	const mobileIPFS = useGomobileIPFS()
	return (
		<PingCard
			style={style}
			name='Local IPFS Gateway'
			address={
				mobileIPFS.gatewayURL + '/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme' // this content must be preloaded in the IPFS nodes
			}
		/>
	)
})
