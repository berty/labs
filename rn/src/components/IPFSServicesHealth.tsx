import React from 'react'
import { ViewStyle } from 'react-native'

import { useGomobileIPFS } from '@berty-labs/react-redux'

import { LoaderCard } from './Card'
import { PingCard } from './PingCard'

export const IPFSServicesHealth: React.FC<{ style?: ViewStyle }> = ({ style }) => {
	const mobileIPFS = useGomobileIPFS()

	if (mobileIPFS.status !== 'up') {
		return <LoaderCard text='Waiting for IPFS node...' />
	}

	const items = [
		{
			name: 'Local IPFS Node API',
			address: mobileIPFS.apiURL + '/api/v0/id',
			opts: {
				method: 'POST',
			},
		},
		{
			name: 'Local IPFS Gateway',
			address: mobileIPFS.gatewayURL,
			allowedStatuses: [404],
		},
		/*{
			name: 'Dead example',
			address: "http://127.0.0.1:1234",
		},*/
	]

	return (
		<>
			{items.map(item => (
				<PingCard style={style} key={item.name} {...item} />
			))}
		</>
	)
}
