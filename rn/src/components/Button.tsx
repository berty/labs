import React from 'react'
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'

import { defaultColors } from '@berty-labs/styles'

export type ButtonParams = {
	title: string
	onPress?: (event: GestureResponderEvent) => void
} & TouchableOpacity['props']

export const Button: React.FC<ButtonParams> = ({
	title,
	onPress,
	style,
	disabled,
	...otherProps
}) => {
	return (
		<View style={{ justifyContent: 'center', alignItems: 'center' }}>
			<TouchableOpacity
				style={[
					{
						width: 200,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: disabled ? defaultColors.grey : defaultColors.blue,
						borderRadius: 6,
						paddingVertical: 15,
						paddingHorizontal: 20,
						marginTop: 30,
					},
					style,
				]}
				onPress={onPress}
				disabled={disabled}
				{...otherProps}
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
