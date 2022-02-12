import React from 'react'
import { ScrollView } from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import {
	AppScreenContainer,
	IPFSAPIHealthCard,
	IPFSGatewayHealthCard,
	LoaderCard,
} from '@berty-labs/components'
import { PingCard } from '@berty-labs/components/PingCard'
import { useGomobileIPFS } from '@berty-labs/react-redux'

const space = 15

const bridgeAllowedStatused = [500]

export const ServicesHealth: ScreenFC<'ServicesHealth'> = () => {
	const mobileIPFS = useGomobileIPFS()
	return (
		<AppScreenContainer>
			<ScrollView style={{ margin: space }}>
				<PingCard
					style={{ marginBottom: space }}
					{...{
						name: 'IPFS Node Manager Server',
						address: 'http://127.0.0.1:9315/ipfsman.v1.IPFSManagerService/Health',
						allowedStatuses: bridgeAllowedStatused,
					}}
				/>
				<PingCard
					style={{ marginBottom: space }}
					{...{
						name: 'Go Labs Modules Server',
						address: 'http://127.0.0.1:9315/blmod.v1.LabsModulesService/Health',
						allowedStatuses: bridgeAllowedStatused,
					}}
				/>
				{mobileIPFS.status === 'up' ? (
					<>
						<IPFSAPIHealthCard style={{ marginBottom: space }} />
						<IPFSGatewayHealthCard />
					</>
				) : (
					<LoaderCard text='Waiting for IPFS node...' />
				)}
			</ScrollView>
		</AppScreenContainer>
	)
}
