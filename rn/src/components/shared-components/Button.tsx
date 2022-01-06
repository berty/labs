import React from 'react'
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'

import { defaultColors } from '@berty-labs/styles'

export type ButtonParams = {
	title: string
	onPress?: (event: GestureResponderEvent) => void
}

export const Button: React.FC<ButtonParams> = ({ title, onPress }) => {
	return (
		<View style={{ justifyContent: 'center', alignItems: 'center' }}>
			<TouchableOpacity
				style={{
					width: 200,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: defaultColors.blue,
					borderRadius: 6,
					paddingVertical: 15,
					paddingHorizontal: 20,
					marginTop: 30,
				}}
				onPress={onPress}
			>
				<Text
					style={{
						color: defaultColors.white,
						fontWeight: '700',
						fontSize: 16,
						fontFamily: 'Open Sans',
					}}
				>
					{title}
				</Text>
			</TouchableOpacity>
		</View>
	)
}
