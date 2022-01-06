import React from 'react'

import { StackScreenProps } from '@react-navigation/stack'

export type ScreensParams = {
	OnBoarding: undefined
	Home: undefined
	IPFSWebUI: undefined
	ServicesHealth: undefined
	GatewaysRace: undefined
	NftCollection: undefined
}

export type ScreenProps<T extends keyof ScreensParams> = StackScreenProps<ScreensParams, T>

export type ScreenFC<T extends keyof ScreensParams> = React.FC<ScreenProps<T>>
