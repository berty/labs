import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native'

import Logo from '@berty-labs/assets/berty-labs-logo.svg'
import { useNavigation, ScreenFC } from '@berty-labs/navigation'

export const OnBoarding: ScreenFC<'OnBoarding'> = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView>
      <StatusBar barStyle='light-content' />
      <Logo width={125} height={125} fill='#FFFFFF' />
      <TouchableOpacity onPress={() => {
        navigation.navigate('Home')
      }}>
        <Text>TEST</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default OnBoarding
