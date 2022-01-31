import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { navigationRef, isReadyRef, Navigation } from '@berty-labs/navigation'
import { store, persistor } from '@berty-labs/redux'
import { LoaderScreen } from '@berty-labs/components'
import { LabsBridgeGate } from '@berty-labs/components'
import { observeIPFS, useIPFSManagerClient } from '@berty-labs/react-redux'

const IPFSProvider: React.FC = ({ children }) => {
	const managerClient = useIPFSManagerClient()
	React.useEffect(() => {
		if (!managerClient) {
			return
		}
		return observeIPFS(managerClient)
	}, [managerClient])
	return <>{children}</>
}

const App = () => {
	return (
		<SafeAreaProvider>
			<LabsBridgeGate>
				<Provider store={store}>
					<PersistGate loading={<LoaderScreen />} persistor={persistor}>
						<IPFSProvider>
							<NavigationContainer
								ref={navigationRef}
								onReady={() => {
									isReadyRef.current = true
								}}
							>
								<Navigation />
							</NavigationContainer>
						</IPFSProvider>
					</PersistGate>
				</Provider>
			</LabsBridgeGate>
		</SafeAreaProvider>
	)
}

export default App
