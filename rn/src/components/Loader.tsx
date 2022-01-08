import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

import { defaultColors } from '@berty-labs/styles'

import { AppScreenContainer } from './AppScreenContainer'

export const Loader: React.FC<{ text?: string }> = ({ text }) => (
	<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		<View>
			{text && (
				<Text style={{ color: defaultColors.white, opacity: 0.7, marginBottom: 30 }}>{text}</Text>
			)}
			<ActivityIndicator />
		</View>
	</View>
)

export const LoaderScreen: React.FC<{ text?: string }> = ({ text }) => (
	<AppScreenContainer>
		<Loader text={text} />
	</AppScreenContainer>
)
