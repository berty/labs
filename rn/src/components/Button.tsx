import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	GestureResponderEvent,
	ActivityIndicator,
} from 'react-native'

import { defaultColors } from '@berty-labs/styles'

export type ButtonParams = {
	title: string
	shrink?: boolean
	onPress?: (event: GestureResponderEvent) => void
	loading?: boolean
} & TouchableOpacity['props']

export const Button: React.FC<ButtonParams> = ({
	title,
	onPress,
	style,
	disabled,
	shrink,
	loading,
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
						flexDirection: 'row',
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
				{!!loading && <ActivityIndicator size={16} style={{ marginRight: 15 }} />}
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
