import React from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'

import { BertyLabsLogo, Splash } from '@berty-labs/assets'
import { useNavigation, ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { useGomobileIPFS } from '@berty-labs/ipfsutil'

import { Button } from '@berty-labs/components'

export const OnBoarding: ScreenFC<'OnBoarding'> = () => {
	const navigation = useNavigation()
	const mobileIPFS = useGomobileIPFS()
	const canContinue = mobileIPFS.state === 'up'

	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			<StatusBar barStyle='light-content' />
			<View style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
				<BertyLabsLogo width={200} />
				<Splash width={227} height={177} />
				<Button
					title={canContinue ? 'DISCOVER' : 'STARTING IPFS...'}
					disabled={!canContinue}
					onPress={() => navigation.navigate('Home')}
				/>
			</View>
		</SafeAreaView>
	)
}

export default OnBoarding
