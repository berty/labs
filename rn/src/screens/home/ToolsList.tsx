import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { IPFSIcon } from '@berty-labs/assets'
import { defaultColors } from '@berty-labs/styles'
import { useNavigation } from '@berty-labs/navigation'

type ToolItemParams = {
	title: string
	desc: string
	avatar?: JSX.Element
	onPress?: () => void
}

const ToolItem: React.FC<ToolItemParams & { isLast: boolean }> = ({
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
							width: 50,
							height: 50,
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
				<View style={{ flex: 1, height: 0.5, backgroundColor: defaultColors.white }} />
			) : null}
		</>
	)
}

export const ToolsList: React.FC = () => {
	const { navigate } = useNavigation()
	const items = React.useMemo<ToolItemParams[]>(() => {
		return [
			{
				title: 'IPFSWebUI',
				desc: 'An interface for IPFS Network Analysis',
				avatar: <IPFSIcon width={40} height={40} />,
			},
			{
				title: 'NFT Collection',
				desc: 'Example of nft collection',
				onPress: () => navigate('NftCollection'),
				avatar: <Text>🎨</Text>,
			},
			{
				title: 'Services Health',
				desc: 'Check embedded services health',
				onPress: () => navigate('ServicesHealth'),
				avatar: <Text>❤️</Text>,
			},
			{
				title: 'Gateways race',
				desc: 'Run race betweeen gomobile and pinata',
				onPress: () => navigate('GatewaysRace'),
				avatar: <Text>🚀</Text>,
			},
		]
	}, [navigate])
	const itemsLength = React.useMemo<number>(() => items.length, [items])

	return (
		<View style={{ marginTop: 15 }}>
			{items.map((item, index) => {
				return <ToolItem key={index} {...item} isLast={index < itemsLength - 1} />
			})}
		</View>
	)
}
