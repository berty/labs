import React from 'react'

import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type ScreensParams = {
	OnBoarding: undefined
	Home: undefined
	IPFSWebUI: undefined
	ServicesHealth: undefined
	GatewaysRace: undefined
	NftCollection: undefined
	NodeManager: undefined
	NodeConfig: { name: string }
}

export type ScreenProps<T extends keyof ScreensParams> = NativeStackScreenProps<ScreensParams, T>

export type ScreenFC<T extends keyof ScreensParams> = React.FC<ScreenProps<T>>
