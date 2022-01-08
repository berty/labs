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

import {
	ServicesHealth,
	GatewaysRace,
	NftCollection,
	OnBoarding,
	Home,
	NodeManager,
	IPFSWebUI,
	NodeConfig,
} from '@berty-labs/screens'
import { defaultColors } from '@berty-labs/styles'

import { ScreensParams } from './types'

export type { ScreensParams, ScreenProps, ScreenFC } from './types'

export const isReadyRef: React.MutableRefObject<any> = React.createRef()
export const navigationRef = React.createRef<NavigationContainerRef<ScreensParams>>()
export const useAppNavigation = () => useReactNavigation<NavigationProp<ScreensParams>>()

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
				options={{ ...screenOptions, title: 'Services Health' }}
			/>
			<NavigationStack.Screen
				name='GatewaysRace'
				component={GatewaysRace}
				options={{ ...screenOptions, title: 'Gateways Race' }}
			/>
			<NavigationStack.Screen
				name={'NftCollection'}
				component={NftCollection}
				options={{ ...screenOptions, title: 'NFT Collection' }}
			/>
			<NavigationStack.Screen
				name={'IPFSWebUI'}
				component={IPFSWebUI}
				options={{ ...screenOptions, title: 'IPFS WebUI' }}
			/>
			<NavigationStack.Screen
				name={'NodeManager'}
				component={NodeManager}
				options={{ ...screenOptions, title: 'IPFS Node Manager' }}
			/>
			<NavigationStack.Screen
				name={'NodeConfig'}
				component={NodeConfig}
				options={{ ...screenOptions, title: 'Node Configuration' }}
			/>
		</NavigationStack.Navigator>
	)
})
