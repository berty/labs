import React from 'react'
import { StatusBar, View } from 'react-native'

import { BertyLabsLogo, Splash } from '@berty-labs/assets'
import { useAppNavigation, ScreenFC } from '@berty-labs/navigation'
import { Button, AppScreenContainer } from '@berty-labs/components'

export const OnBoarding: ScreenFC<'OnBoarding'> = () => {
	const navigation = useAppNavigation()
	return (
		<AppScreenContainer>
			<StatusBar barStyle='light-content' />
			<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
				<BertyLabsLogo width={200} />
				<Splash width={227} height={177} />
				<Button title='DISCOVER' onPress={() => navigation.navigate('Home')} />
			</View>
		</AppScreenContainer>
	)
}

export default OnBoarding
