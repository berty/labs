import React, { useCallback } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { TextDecoder, TextEncoder } from 'text-encoding'

import { ScreenFC, useAppNavigation } from '@berty-labs/navigation'
import { useAppDispatch, useAppSelector, useLabsModulesClient } from '@berty-labs/react-redux'
import { AppScreenContainer, Card, LoaderCard } from '@berty-labs/components'
import { defaultColors } from '@berty-labs/styles'
import { blmod } from '@berty-labs/api'
import {
	addModuleText,
	moduleDone,
	moduleFailed,
	runModule,
	selectModuleState,
	setModuleArgs,
} from '@berty-labs/redux'

const space = 15

const utf8Decoder = new TextDecoder('utf-8')
const utf8Encoder = new TextEncoder()

const streams: { [key: string]: blmod.ResponseStream<blmod.RunModuleResponse> | undefined } = {}

export const GoModule: ScreenFC<'GoModule'> = ({
	route: {
		params: { name, displayName },
	},
}) => {
	const { setOptions } = useAppNavigation()
	React.useEffect(() => {
		setOptions({ title: displayName })
	}, [setOptions, displayName])
	const { state, text, error, args } = useAppSelector(state => selectModuleState(state, name))
	const running = state === 'running'
	const dispatch = useAppDispatch()
	const modulesClient = useLabsModulesClient()
	const handleRun = useCallback(() => {
		if (!modulesClient || state === 'running' || streams[name]) {
			return
		}

		dispatch(runModule({ name }))
		const req = new blmod.RunModuleRequest()
		req.setName(name)
		if (args) {
			req.setArgs(utf8Encoder.encode(args))
		}

		const cl = modulesClient.runModule(req)
		streams[name] = cl

		cl.on('data', reply => {
			const str = utf8Decoder.decode(reply.getPayload_asU8())
			let text = ''
			try {
				const obj = JSON.parse(str)
				if (typeof obj === 'string') {
					text = obj + '\n'
				} else {
					text = JSON.stringify(obj, null, 4) + '\n'
				}
			} catch (err) {
				text = str + '\n'
			}
			dispatch(addModuleText({ name, text }))
		})

		cl.on('end', (...args) => {
			console.log('end:', ...args)
			streams[name] = undefined
			const [status] = args
			if (status?.code) {
				dispatch(
					moduleFailed({
						name,
						error: `Code ${status.code}\n\n$${status.details}\n\n${status}`,
					}),
				)
				return
			}
			dispatch(moduleDone({ name }))
		})

		cl.on('status', (...args) => {
			console.log('status:', ...args)
		})
	}, [args, dispatch, modulesClient, name, state])
	const handleArgsChange = useCallback(
		(args: string) => dispatch(setModuleArgs({ name, args })),
		[dispatch, name],
	)
	const handleCancel = useCallback(() => {
		const strm = streams[name]
		if (strm) {
			console.log('cancelling')
			strm.cancel()
			streams[name] = undefined
			dispatch(moduleFailed({ name, error: 'Cancelled' }))
		}
	}, [name, dispatch])
	const textSize = 20
	return (
		<AppScreenContainer>
			<ScrollView style={{ margin: space }}>
				{!running && (
					<Card style={{ marginBottom: space }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TextInput
								style={{
									color: defaultColors.text,
									flex: 1,
									fontSize: textSize,
									textAlignVertical: 'center',
								}}
								placeholder='Enter args...'
								onChangeText={handleArgsChange}
								value={args}
							/>
							<Pressable onPress={handleRun}>
								<Text
									style={{
										fontSize: textSize,
										textAlignVertical: 'center',
									}}
								>
									🏃
								</Text>
							</Pressable>
						</View>
					</Card>
				)}
				{running && (
					<LoaderCard
						text='Running...'
						style={{ marginBottom: space }}
						size={textSize}
						onCancel={handleCancel}
					/>
				)}
				{!!(running || text) && (
					<Card style={{ marginBottom: space }}>
						<Text style={{ color: defaultColors.text }} selectable={true}>
							{text.trim()}
						</Text>
					</Card>
				)}
				{!!error && (
					<Card title='❌ Error'>
						<Text style={{ color: defaultColors.text, opacity: 0.7 }} selectable={true}>
							{error}
						</Text>
					</Card>
				)}
				{!!text && !running && !error && <Card title='✔️ Success' />}
			</ScrollView>
		</AppScreenContainer>
	)
}
