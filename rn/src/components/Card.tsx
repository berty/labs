import React, { useMemo } from 'react'
import {
	TouchableOpacity,
	TouchableOpacityProps,
	Text,
	View,
	ViewProps,
	ActivityIndicator,
	Pressable,
	ViewStyle,
	TextInput,
	TextInputProps,
	PressableProps,
} from 'react-native'

import { defaultColors } from '@berty-labs/styles'

const textStyle = { color: defaultColors.text }

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
				<Text style={[textStyle, { fontSize: 25, marginBottom: children ? 15 : undefined }]}>
					{title}
				</Text>
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

export const LoaderCard: React.FC<
	{ text: string; size?: number; onCancel?: () => void } & CardProps
> = React.memo(({ text, children, size, onCancel, ...other }) => (
	<Card {...other}>
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				width: '100%',
			}}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<ActivityIndicator size={size} />
				<Text style={[textStyle, { marginLeft: size ? size / 2 : 7.5, fontSize: size }]}>
					{text}
				</Text>
			</View>
			{typeof onCancel === 'function' && (
				<Pressable onPress={onCancel}>
					<Text>❌</Text>
				</Pressable>
			)}
		</View>
		{children}
	</Card>
))

const rowStyle: ViewStyle = { flexDirection: 'row', alignItems: 'center' }

export const TextInputCard: React.FC<
	{
		style?: ViewStyle
		textSize?: number
		onConfirm?: PressableProps['onPress']
		confirmText?: string
	} & Omit<TextInputProps, 'style'>
> = React.memo(({ style, textSize = 20, onConfirm, confirmText = '➡️', ...props }) => {
	const textInputStyle: ViewStyle = useMemo(
		() => ({
			color: defaultColors.text,
			flex: 1,
			fontSize: textSize,
		}),
		[textSize],
	)
	const textStyle = useMemo(() => ({ fontSize: textSize }), [textSize])
	return (
		<Card style={style}>
			<View style={rowStyle}>
				<TextInput style={textInputStyle} {...props} />
				{typeof onConfirm === 'function' && (
					<Pressable onPress={onConfirm}>
						<Text style={textStyle}>{confirmText}</Text>
					</Pressable>
				)}
			</View>
		</Card>
	)
})
