import React from 'react'
import { SafeAreaView } from 'react-native'

import { defaultColors } from '@berty-labs/styles'

export const AppScreenContainer: React.FC = ({ children }) => {
	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			{children}
		</SafeAreaView>
	)
}
