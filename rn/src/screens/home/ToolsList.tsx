import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { TextDecoder } from 'text-encoding'
import * as FileSystem from 'expo-file-system'

import { IPFSIcon } from '@berty-labs/assets'
import { defaultColors } from '@berty-labs/styles'
import { useAppNavigation } from '@berty-labs/navigation'
import { useAsyncTransform } from '@berty-labs/reactutil'
import { useLabsModulesClient } from '@berty-labs/react-redux'
import { blmod } from '@berty-labs/api'

type ToolItemParams = {
	title: string
	desc: string
	avatar?: JSX.Element
	onPress?: () => void
	key: string
}

const ToolItem: React.FC<ToolItemParams & { isLast: boolean; searchText: string }> = React.memo(
	({ title, desc, avatar, isLast, onPress }) => {
		return (
			<>
				<TouchableOpacity onPress={onPress} style={{ justifyContent: 'center' }}>
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
						<View style={{ flex: 1 }}>
							<Text style={{ color: defaultColors.text, fontWeight: '700' }}>{title}</Text>
							<Text style={{ color: defaultColors.text, opacity: 0.7 }} numberOfLines={1}>
								{desc}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
				{!isLast ? (
					<View
						style={{
							flex: 1,
							height: 0.5,
							backgroundColor: defaultColors.text,
							opacity: 0.5,
							marginVertical: 10,
						}}
					/>
				) : null}
			</>
		)
	},
)

const iconsSize = 30
const utfIconStyle = { fontSize: iconsSize - 6, color: 'white' }
const utfIconContainerStyle: ViewStyle = {
	width: iconsSize,
	height: iconsSize,
	justifyContent: 'center',
	alignItems: 'center',
}

const amap = <I, O>(items: I[], transform: (item: I) => Promise<O>) =>
	Promise.all(items.map(transform))

type Module = {
	name: string
	displayName?: string
	shortDescription?: string
	iconKind?: 'UTF'
	iconUTF?: string
	infoError?: unknown
}

export const ToolsList: React.FC<{ searchText: string }> = React.memo(({ searchText }) => {
	const { navigate } = useAppNavigation()
	const modulesClient = useLabsModulesClient()

	const [goModules] = useAsyncTransform(async () => {
		const reply = await modulesClient?.AllModules({})
		return reply?.modules
	}, [modulesClient])

	const [htmlMods] = useAsyncTransform(async () => {
		const mods = await FileSystem.readDirectoryAsync(
			`${FileSystem.bundleDirectory}html-mods.bundle`,
		)
		console.log('html mods:', mods)
		const infos = await amap(mods, async mod => {
			try {
				const jsonData = await FileSystem.readAsStringAsync(
					`${FileSystem.bundleDirectory}html-mods.bundle/${mod}/info.json`,
				)
				const info: Module = JSON.parse(jsonData)
				info.name = mod
				return info
			} catch (err) {
				const info: Module = { name: mod, infoError: err }
				return info
			}
		})
		console.log('html mods infos:', infos)
		return infos
	})

	const items = React.useMemo<ToolItemParams[]>(() => {
		return [
			{
				key: 'ipfs-web-ui',
				title: 'IPFS Web Interface',
				desc: 'Inspect IPFS node and network',
				onPress: () => navigate('IPFSWebUI'),
				avatar: <IPFSIcon width={iconsSize} height={iconsSize} />,
			},
			{
				key: 'ipfs-node-manager',
				title: 'IPFS Node Manager',
				desc: 'Configure and select IPFS nodes',
				onPress: () => navigate('NodeManager'),
				avatar: (
					<View style={utfIconContainerStyle}>
						<Text style={utfIconStyle}>🔧</Text>
					</View>
				),
			},
			{
				key: 'labs-services-health',
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
				key: 'p2p-browser',
				title: 'P2P Browser',
				desc: 'P2P-enabled browser',
				onPress: () => navigate('Browser'),
				avatar: (
					<View style={utfIconContainerStyle}>
						<Text style={utfIconStyle}>🏄</Text>
					</View>
				),
			},
			{
				key: 'ipfs-node-logs',
				title: 'IPFS Node Logs',
				desc: 'View active IPFS node logs',
				onPress: () => navigate('IPFSLogs'),
				avatar: (
					<View style={utfIconContainerStyle}>
						<Text style={utfIconStyle}>📜</Text>
					</View>
				),
			},
			...(htmlMods || []).map(modInfo => {
				let avatarText = 'H'
				if (modInfo.iconKind === 'UTF' && modInfo.iconUTF) {
					avatarText = modInfo.iconUTF
				}
				return {
					key: modInfo.name,
					title: modInfo.displayName || 'HTML Module',
					desc: modInfo.shortDescription || '',
					onPress: () =>
						navigate('HTMLModule', { name: modInfo.name, displayName: modInfo.displayName }),
					avatar: (
						<View style={utfIconContainerStyle}>
							<Text style={utfIconStyle}>{avatarText}</Text>
						</View>
					),
				}
			}),
			...(goModules || []).map(mod => {
				let icon = 'G'
				if (mod.iconKind === blmod.ModuleInfo_IconKind.ICON_KIND_UTF && mod.iconData.length) {
					try {
						const utf8Decoder = new TextDecoder('utf-8')
						const modIcon = utf8Decoder.decode(mod.iconData)
						if (modIcon) {
							icon = modIcon
						}
					} catch (err) {
						console.warn('failed to decode icon:', err)
					}
				}
				return {
					key: mod.name,
					title: mod.displayName,
					desc: mod.shortDescription,
					onPress: () => navigate('GoModule', { name: mod.name, displayName: mod.displayName }),
					avatar: (
						<View style={utfIconContainerStyle}>
							<Text style={utfIconStyle}>{icon}</Text>
						</View>
					),
				}
			}),
			{
				key: 'ipfs-gateways-race',
				title: 'Gateways Race',
				desc: 'Run race between gomobile and pinata',
				onPress: () => navigate('GatewaysRace'),
				avatar: (
					<View style={utfIconContainerStyle}>
						<Text style={utfIconStyle}>🚀</Text>
					</View>
				),
			},
			{
				key: 'art-collection',
				title: 'Art Collection',
				desc: 'Browse an art collection',
				onPress: () => navigate('ArtCollection'),
				avatar: (
					<View style={utfIconContainerStyle}>
						<Text style={utfIconStyle}>🎨</Text>
					</View>
				),
			},
		]
	}, [navigate, htmlMods, goModules])

	const itemsWithSearch = React.useMemo(() => {
		return (
			searchText
				? items.filter(
						item =>
							item.title.toLowerCase().indexOf(searchText) >= 0 ||
							item.desc.toLowerCase().indexOf(searchText) >= 0,
				  )
				: items
		).sort((a, b) => a.title.localeCompare(b.title))
	}, [items, searchText])

	return (
		<View>
			{itemsWithSearch.map((item, index) => {
				return (
					<ToolItem
						{...item}
						searchText={searchText}
						isLast={index === itemsWithSearch.length - 1}
					/>
				)
			})}
		</View>
	)
})
