import React from 'react'
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'

import { defaultColors } from '@berty-labs/styles'

export type ButtonParams = {
	title: string
	shrink?: boolean
	onPress?: (event: GestureResponderEvent) => void
} & TouchableOpacity['props']

export const Button: React.FC<ButtonParams> = ({
	title,
	onPress,
	style,
	disabled,
	shrink,
	...otherProps
}) => {
	return (
		<View style={{ justifyContent: 'center', alignItems: 'center' }}>
			<TouchableOpacity
				style={[
					{
						minWidth: shrink ? undefined : 200,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: disabled ? defaultColors.grey : defaultColors.blue,
						borderRadius: 6,
						paddingVertical: 15,
						paddingHorizontal: 20,
					},
					style,
				]}
				onPress={onPress}
				disabled={disabled}
				{...otherProps}
			>
				<Text
					style={{
						color: defaultColors.text,
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
