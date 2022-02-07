import React from 'react'
import { View, ScrollView, TextInput, ViewStyle } from 'react-native'

import { BertyLabsLogo, Search, TextBerty, TextLabs } from '@berty-labs/assets'
import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { AppScreenContainer } from '@berty-labs/components'

import { ToolsList } from './ToolsList'

const size = 16
const logoSize = 1.4

const HeaderHome: React.FC<{ onSearchChange: (s: string) => void; style?: ViewStyle }> = React.memo(
	({ onSearchChange, style }) => {
		return (
			<View style={style}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<TextBerty height={size * 0.67 * logoSize} />
					<BertyLabsLogo width={size * 3 * logoSize} height={size * 3 * logoSize} />
					<TextLabs height={size * 0.76 * logoSize} />
				</View>
				<View
					style={{
						flexDirection: 'row',
						height: size * 2.5,
						borderRadius: size * 0.4,
						backgroundColor: defaultColors.black,
						alignItems: 'center',
						paddingLeft: size,
					}}
				>
					<Search width={size} height={size} />
					<TextInput
						autoCorrect={false}
						placeholderTextColor={defaultColors.text + 'B0'}
						style={{ color: defaultColors.text, flex: 1, marginLeft: 10, fontFamily: 'Open Sans' }}
						placeholder='Search for tool'
						onChange={evt => onSearchChange(evt.nativeEvent.text)}
					/>
				</View>
			</View>
		)
	},
)

export const Home: ScreenFC<'Home'> = React.memo(() => {
	const [searchString, setSearchString] = React.useState('')
	return (
		<AppScreenContainer>
			<HeaderHome
				onSearchChange={setSearchString}
				style={{ marginHorizontal: size, marginBottom: size }}
			/>
			<ScrollView style={{ marginHorizontal: size, marginBottom: size }}>
				<ToolsList searchText={searchString.toLowerCase()} />
			</ScrollView>
		</AppScreenContainer>
	)
})

export default Home
