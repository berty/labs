import React from 'react'
import { ScrollView, Text } from 'react-native'
import { TextDecoder } from 'text-encoding'

import { ScreenFC, useAppNavigation } from '@berty-labs/navigation'
import { useLabsModulesClient } from '@berty-labs/react-redux'
import { AppScreenContainer } from '@berty-labs/components'
import { useAsyncTransform } from '@berty-labs/reactutil'
import { blmod } from '@berty-labs/api'
import { defaultColors } from '@berty-labs/styles'

export const GoModule: ScreenFC<'GoModule'> = ({
	route: {
		params: { name, displayName },
	},
}) => {
	const { setOptions } = useAppNavigation()
	React.useEffect(() => {
		setOptions({ title: displayName })
	}, [setOptions, displayName])
	const modulesClient = useLabsModulesClient()
	const [report, running, err] = useAsyncTransform(async () => {
		const reply = await modulesClient?.RunModule({ name })
		if (!reply || reply.reportKind !== blmod.RunModuleResponse_ReportKind.REPORT_KIND_UTF) {
			return undefined
		}
		const utf8Decoder = new TextDecoder('utf-8')
		return utf8Decoder.decode(reply.reportData)
	}, [modulesClient, name])
	let content = report
	if (err) {
		content = JSON.stringify(err, null, 4)
	} else if (running) {
		content = 'Running...'
	}
	return (
		<AppScreenContainer>
			<ScrollView style={{ padding: 15 }}>
				<Text style={{ color: defaultColors.white }}>{content}</Text>
			</ScrollView>
		</AppScreenContainer>
	)
}
