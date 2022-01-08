import React from 'react'
import { View } from 'react-native'

import { ScreenFC } from '@berty-labs/navigation'
import { AppScreenContainer, IPFSServicesHealth } from '@berty-labs/components'

const space = 15

export const ServicesHealth: ScreenFC<'ServicesHealth'> = () => {
	return (
		<AppScreenContainer>
			<View style={{ padding: space }}>
				<IPFSServicesHealth style={{ marginBottom: space }} />
			</View>
		</AppScreenContainer>
	)
}
