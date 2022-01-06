import React from 'react'
import {
	createNativeStackNavigator,
	NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import {
	NavigationContainerRef,
	useNavigation as useReactNavigation,
	NavigationProp,
} from '@react-navigation/native'

import { ServicesHealth, GatewaysRace, NftCollection, OnBoarding, Home } from '@berty-labs/screens'

import { ScreensParams } from './types'
import { defaultColors } from '@berty-labs/styles'

export type { ScreensParams, ScreenProps, ScreenFC } from './types'

export const isReadyRef: React.MutableRefObject<any> = React.createRef()
export const navigationRef = React.createRef<NavigationContainerRef<ScreensParams>>()
export const useNavigation = () => useReactNavigation<NavigationProp<ScreensParams>>()

const screenOptions: NativeStackNavigationOptions = {
	headerStyle: {
		backgroundColor: defaultColors.background,
	},
	headerTitleStyle: {
		fontFamily: 'Open Sans',
		fontWeight: '700',
		fontSize: 20,
	},
	headerTintColor: defaultColors.white,
	headerBackTitleVisible: false,
	headerShadowVisible: false,
}

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
			<NavigationStack.Screen
				name='ServicesHealth'
				component={ServicesHealth}
				options={screenOptions}
			/>
			<NavigationStack.Screen
				name='GatewaysRace'
				component={GatewaysRace}
				options={screenOptions}
			/>
			<NavigationStack.Screen
				name={'NftCollection'}
				component={NftCollection}
				options={screenOptions}
			/>
		</NavigationStack.Navigator>
	)
})
