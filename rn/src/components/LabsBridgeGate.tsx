import React from 'react'
import { Text } from 'react-native'
import { ScreenContainer } from 'react-native-screens'

import { useLabsBridgeState } from '@berty-labs/react-redux'

import { LoaderScreen } from './Loader'

export const LabsBridgeGate: React.FC<{ loader?: JSX.Element }> = ({ loader, children }) => {
	const [state, , err] = useLabsBridgeState()
	if (!loader) {
		loader = <LoaderScreen text='Starting bridge..' />
	}
	switch (state) {
		case 'starting':
			return loader || null
		case 'up':
			return <>{children}</>
		case 'error':
			return (
				<ScreenContainer>
					<Text>Failed to start bridge :(</Text>
					<Text>{JSON.stringify(err, null, 4)}</Text>
				</ScreenContainer>
			)
	}
}
