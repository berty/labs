import React from 'react'
import {
	TouchableOpacity,
	TouchableOpacityProps,
	Text,
	View,
	ViewProps,
	ActivityIndicator,
} from 'react-native'

import { defaultColors } from '@berty-labs/styles'

const textStyle = { color: defaultColors.white }

export type CardProps = { title?: string } & ViewProps

export const Card: React.FC<CardProps> = React.memo(({ title, children, style, ...otherProps }) => {
	return (
		<View
			style={[
				{
					alignItems: 'flex-start',
					padding: 15,
					backgroundColor: '#00000030',
					borderRadius: 6,
				},
				style,
			]}
			{...otherProps}
		>
			{typeof title === 'string' && (
				<Text style={[textStyle, { fontSize: 25, marginBottom: 15 }]}>{title}</Text>
			)}
			{children}
		</View>
	)
})

export const PressableCard: React.FC<{ onPress: TouchableOpacityProps['onPress'] } & CardProps> =
	React.memo(({ onPress, ...otherProps }) => {
		return (
			<TouchableOpacity onPress={onPress}>
				<Card {...otherProps} />
			</TouchableOpacity>
		)
	})

export const LoaderCard: React.FC<{ text: string } & CardProps> = React.memo(
	({ text, children, ...other }) => (
		<Card {...other}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<ActivityIndicator />
				<Text style={[textStyle, { marginLeft: 7.5 }]}>{text}</Text>
			</View>
			{children}
		</Card>
	),
)
