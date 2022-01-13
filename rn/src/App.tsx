import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { navigationRef, isReadyRef, Navigation } from '@berty-labs/navigation'
import { store, persistor } from '@berty-labs/redux'
import { LoaderScreen } from '@berty-labs/components'
import '@berty-labs/react-redux'

const App = () => {
	return (
		<SafeAreaProvider>
			<Provider store={store}>
				<PersistGate loading={<LoaderScreen />} persistor={persistor}>
					<NavigationContainer
						ref={navigationRef}
						onReady={() => {
							isReadyRef.current = true
						}}
					>
						<Navigation />
					</NavigationContainer>
				</PersistGate>
			</Provider>
		</SafeAreaProvider>
	)
}

export default App
