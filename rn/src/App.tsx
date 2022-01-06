import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { navigationRef, isReadyRef, Navigation } from './navigation'
import { GomobileIPFSProvider } from './ipfsutil'

const App = () => {
	return (
		<SafeAreaProvider>
			<GomobileIPFSProvider>
				<NavigationContainer
					ref={navigationRef}
					onReady={() => {
						isReadyRef.current = true
					}}
				>
					<Navigation />
				</NavigationContainer>
			</GomobileIPFSProvider>
		</SafeAreaProvider>
	)
}

export default App
