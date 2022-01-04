import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { navigationRef, isReadyRef, Navigation } from './navigation'

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
        isReadyRef.current = true
        }}
      >
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
