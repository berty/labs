import React from 'react'
import { SafeAreaView } from 'react-native'

import { defaultColors } from '@berty-labs/styles'
// import { useGomobileIPFS } from '@berty-labs/ipfsutil'
import { ScreenFC } from '@berty-labs/navigation'
import { Button } from '@berty-labs/components'

export const UploadFile: ScreenFC<'UploadFile'> = () => {
	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			<Button
				title='Upload'
				onPress={async () => {
					// await client.add('Hello world')
				}}
			/>
		</SafeAreaView>
	)
}
