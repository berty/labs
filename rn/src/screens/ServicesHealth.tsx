import React from 'react'
import { ScrollView, ViewStyle } from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import { AppScreenContainer, IPFSServicesHealth } from '@berty-labs/components'
import { PingCard } from '@berty-labs/components/PingCard'

const space = 15

const cardStyle: ViewStyle = { marginBottom: space }

export const ServicesHealth: ScreenFC<'ServicesHealth'> = () => {
	const items = [
		{
			name: 'IPFS Node Manager Server',
			address: 'http://127.0.0.1:9315',
		},
		{
			name: 'Go Labs Modules Server',
			address: 'http://127.0.0.1:9315',
		},
		/*{
			name: 'Dead example',
			address: "http://127.0.0.1:1234",
		},*/
	]
	return (
		<AppScreenContainer>
			<ScrollView style={{ padding: space }}>
				{items.map(item => (
					<PingCard style={cardStyle} key={item.name} name={item.name} address={item.address} />
				))}
				<IPFSServicesHealth style={cardStyle} />
			</ScrollView>
		</AppScreenContainer>
	)
}
