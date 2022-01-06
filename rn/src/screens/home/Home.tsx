import React from 'react'
import { SafeAreaView, View, ScrollView, TextInput } from 'react-native'

import { BertyLabsLogo, Search, TextBerty, TextLabs } from '@berty-labs/assets'
import { ScreenFC } from '@berty-labs/navigation/types'
import { defaultColors } from '@berty-labs/styles'

import { ToolsList } from './ToolsList'

const HeaderHome: React.FC<{ onSearchChange: (s: string) => void }> = ({ onSearchChange }) => {
	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					flex: 1,
				}}
			>
				<View style={{ flex: 1 }}>
					<TextBerty height={13} />
				</View>
				<View>
					<BertyLabsLogo width={60} height={60} />
				</View>
				<View style={{ flex: 1 }}>
					<TextLabs height={15} style={{ alignSelf: 'flex-end' }} />
				</View>
			</View>
			<View
				style={{
					flexDirection: 'row',
					height: 50,
					flex: 1,
					borderRadius: 8,
					backgroundColor: defaultColors.black,
					alignItems: 'center',
					paddingLeft: 20,
				}}
			>
				<Search width={20} height={20} />
				<TextInput
					autoCorrect={false}
					placeholderTextColor={defaultColors.white + 'B0'}
					style={{ color: defaultColors.white, flex: 1, marginLeft: 10, fontFamily: 'Open Sans' }}
					placeholder='Search for tool'
					onChange={evt => onSearchChange(evt.nativeEvent.text)}
				/>
			</View>
		</View>
	)
}

export const Home: ScreenFC<'Home'> = () => {
	const [searchString, setSearchString] = React.useState('')
	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			<ScrollView style={{ marginHorizontal: 20 }}>
				<HeaderHome onSearchChange={setSearchString} />
				<ToolsList searchText={searchString.toLowerCase()} />
			</ScrollView>
		</SafeAreaView>
	)
}

export default Home
