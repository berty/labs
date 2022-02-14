import React from 'react'

import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type ScreensParams = {
	OnBoarding: undefined
	Home: undefined
	IPFSWebUI: undefined
	ServicesHealth: undefined
	GatewaysRace: undefined
	ArtCollection: undefined
	NodeManager: undefined
	NodeConfig: { name: string }
	GoModule: { name: string; displayName: string }
	HTMLModule: {
		name: string
		displayName?: string
	}
	IPFSLogs: undefined
	Browser: undefined
	Wikipedia: undefined
}

export type ScreenName = keyof ScreensParams

export type ScreenProps<T extends keyof ScreensParams> = NativeStackScreenProps<ScreensParams, T>

export type ScreenFC<T extends keyof ScreensParams> = React.FC<ScreenProps<T>>
