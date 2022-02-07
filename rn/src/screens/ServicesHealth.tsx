import React from 'react'
import { ScrollView, ViewStyle } from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import { AppScreenContainer, IPFSServicesHealth } from '@berty-labs/components'
import { PingCard, PingOpts } from '@berty-labs/components/PingCard'

const space = 15

const cardStyle: ViewStyle = { marginBottom: space }

const items: PingOpts[] = [
	{
		name: 'IPFS Node Manager Server',
		address: 'http://127.0.0.1:9315/ipfsman.v1.IPFSManagerService/Health',
		allowedStatuses: [500],
	},
	{
		name: 'Go Labs Modules Server',
		address: 'http://127.0.0.1:9315/blmod.v1.LabsModulesService/Health',
		allowedStatuses: [500],
	},
	/*{
		name: 'Dead example',
		address: "http://127.0.0.1:1234",
	},*/
]

export const ServicesHealth: ScreenFC<'ServicesHealth'> = () => {
	return (
		<AppScreenContainer>
			<ScrollView style={{ margin: space }}>
				{items.map(item => (
					<PingCard style={cardStyle} key={item.name} {...item} />
				))}
				<IPFSServicesHealth style={cardStyle} />
			</ScrollView>
		</AppScreenContainer>
	)
}
