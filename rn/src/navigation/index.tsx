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
	ArtCollection,
	OnBoarding,
	Home,
	NodeManager,
	IPFSWebUI,
	NodeConfig,
	GoModule,
	HTMLModule,
	IPFSLogs,
	Browser,
	Wikipedia,
} from '@berty-labs/screens'
import { defaultColors } from '@berty-labs/styles'

import { ScreensParams } from './types'
import { useAppSelector } from '@berty-labs/react-redux'
import { selectOnboarded } from '@berty-labs/redux'

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
	headerTintColor: defaultColors.text,
	headerBackTitleVisible: false,
	headerShadowVisible: false,
}

const NavigationStack = createNativeStackNavigator<ScreensParams>()
export const Navigation: React.FC = React.memo(() => {
	const onboarded = useAppSelector(selectOnboarded)
	console.log('onboarded:', onboarded)
	return (
		<NavigationStack.Navigator initialRouteName={onboarded ? 'Home' : 'OnBoarding'}>
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
				name={'ArtCollection'}
				component={ArtCollection}
				options={{ ...screenOptions, title: 'Art Collection' }}
			/>
			<NavigationStack.Screen
				name={'IPFSWebUI'}
				component={IPFSWebUI}
				options={{ ...screenOptions, title: 'IPFS Web Interface' }}
			/>
			<NavigationStack.Screen
				name={'IPFSLogs'}
				component={IPFSLogs}
				options={{ ...screenOptions, title: 'IPFS Node Logs' }}
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
			<NavigationStack.Screen
				name={'GoModule'}
				component={GoModule}
				options={{ ...screenOptions, title: 'Go Module' }}
			/>
			<NavigationStack.Screen
				name={'HTMLModule'}
				component={HTMLModule}
				options={{ ...screenOptions, title: 'HTML Module' }}
			/>
			<NavigationStack.Screen
				name={'Browser'}
				component={Browser}
				options={{ ...screenOptions, title: 'Browser' }}
			/>
			<NavigationStack.Screen
				name='Wikipedia'
				component={Wikipedia}
				options={{ ...screenOptions, title: 'Wikipedia' }}
			/>
		</NavigationStack.Navigator>
	)
})
