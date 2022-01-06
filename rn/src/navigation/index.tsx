import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
	NavigationContainerRef,
	useNavigation as useReactNavigation,
	NavigationProp,
} from '@react-navigation/native'

import { OnBoarding, Home } from '@berty-labs/components'
import { ServicesHealth, GatewaysRace } from '@berty-labs/screens'

import { ScreensParams } from './types'

export type { ScreensParams, ScreenProps, ScreenFC } from './types'

export const isReadyRef: React.MutableRefObject<any> = React.createRef()
export const navigationRef = React.createRef<NavigationContainerRef<ScreensParams>>()
export const useNavigation = () => useReactNavigation<NavigationProp<ScreensParams>>()

const NavigationStack = createNativeStackNavigator<ScreensParams>()
export const Navigation: React.FC = React.memo(() => {
	return (
		<NavigationStack.Navigator initialRouteName='OnBoarding'>
			<NavigationStack.Screen name={'Home'} component={Home} options={{ headerShown: false }} />
			<NavigationStack.Screen
				name={'OnBoarding'}
				component={OnBoarding}
				options={{ headerShown: false }}
			/>
			<NavigationStack.Screen name='ServicesHealth' component={ServicesHealth} />
			<NavigationStack.Screen name='GatewaysRace' component={GatewaysRace} />
		</NavigationStack.Navigator>
	)
})
