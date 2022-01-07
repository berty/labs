import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'

import { IPFSIcon } from '@berty-labs/assets'
import { defaultColors } from '@berty-labs/styles'
import { useNavigation } from '@berty-labs/navigation'

type ToolItemParams = {
	title: string
	desc: string
	avatar?: JSX.Element
	onPress?: () => void
}

const ToolItem: React.FC<ToolItemParams & { isLast: boolean; searchText: string }> = ({
	title,
	desc,
	avatar,
	isLast,
	onPress,
}) => {
	return (
		<>
			<TouchableOpacity onPress={onPress} style={{ height: 70, justifyContent: 'center' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View
						style={{
							marginRight: 10,
							padding: 10,
							borderColor: defaultColors.grey,
							borderWidth: 0.5,
							borderRadius: 50,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{avatar ? avatar : null}
					</View>
					<View style={{ flexDirection: 'column' }}>
						<Text style={{ color: defaultColors.white, fontWeight: '700' }}>{title}</Text>
						<Text style={{ color: defaultColors.white, opacity: 0.7 }}>{desc}</Text>
					</View>
				</View>
			</TouchableOpacity>
			{isLast ? (
				<View
					style={{ flex: 1, height: 0.5, backgroundColor: defaultColors.white, opacity: 0.5 }}
				/>
			) : null}
		</>
	)
}

const iconsSize = 30
const utfIconStyle = { fontSize: iconsSize - 6 }
const utfIconContainerStyle: ViewStyle = {
	width: iconsSize,
	height: iconsSize,
	justifyContent: 'center',
	alignItems: 'center',
}

export const ToolsList: React.FC<{ searchText: string }> = ({ searchText }) => {
	const { navigate } = useNavigation()

	const items = React.useMemo<ToolItemParams[]>(() => {
		return [
			{
				title: 'IPFS Web Interface',
				desc: 'Inspect IPFS node and network',
				onPress: () => navigate('IPFSWebUI'),
				avatar: <IPFSIcon width={iconsSize} height={iconsSize} />,
			},
			{
				title: 'NFT Collection',
				desc: 'Browse an NFT collection',
				onPress: () => navigate('NftCollection'),
				avatar: (
					<View style={utfIconContainerStyle}>
						<Text style={utfIconStyle}>🎨</Text>
					</View>
				),
			},
			{
				title: 'Services Health',
				desc: 'Check embedded services health',
				onPress: () => navigate('ServicesHealth'),
				avatar: (
					<View style={utfIconContainerStyle}>
						<Text style={[utfIconStyle, { position: 'relative', top: 2 }]}>❤️</Text>
					</View>
				),
			},
			{
				title: 'Gateways Race',
				desc: 'Run race between gomobile and pinata',
				onPress: () => navigate('GatewaysRace'),
				avatar: (
					<View style={utfIconContainerStyle}>
						<Text style={utfIconStyle}>🚀</Text>
					</View>
				),
			},
		]
	}, [navigate])

	const itemsWithSearch = React.useMemo(() => {
		return searchText
			? items.filter(
					item =>
						item.title.toLowerCase().indexOf(searchText) !== -1 ||
						item.desc.toLowerCase().indexOf(searchText) !== -1,
			  )
			: items
	}, [items, searchText])

	return (
		<View style={{ marginTop: 15 }}>
			{itemsWithSearch.map((item, index) => {
				return (
					<ToolItem
						key={index}
						{...item}
						searchText={searchText}
						isLast={index < itemsWithSearch.length - 1}
					/>
				)
			})}
		</View>
	)
}
