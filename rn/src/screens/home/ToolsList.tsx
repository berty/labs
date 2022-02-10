import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, ViewStyle, Animated, Easing } from 'react-native'
import { TextDecoder } from 'text-encoding'
import * as FileSystem from 'expo-file-system'

import { IPFSIcon } from '@berty-labs/assets'
import { defaultColors } from '@berty-labs/styles'
import { useAppNavigation } from '@berty-labs/navigation'
import { useAsyncTransform } from '@berty-labs/reactutil'
import { useAppSelector, useLabsModulesClient } from '@berty-labs/react-redux'
import { blmod } from '@berty-labs/api'
import { selectModuleState } from '@berty-labs/redux'
import { grpcPromise } from '@berty-labs/grpcutil'
import { base64 } from '@berty-labs/encoding'

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

type HTMLModule = {
	name: string
	displayName?: string
	shortDescription?: string
	iconKind?: 'UTF'
	iconUTF?: string
	infoError?: unknown
}

const maxOpacity = 1
const animDuration = 1000

const GoModuleAvatar: React.FC<{ name: string; icon: string }> = React.memo(({ name, icon }) => {
	const { state } = useAppSelector(state => selectModuleState(state, name))
	const fadeAnim = useRef(new Animated.Value(maxOpacity)).current
	useEffect(() => {
		if (state !== 'running') {
			return
		}
		const anim = Animated.loop(
			Animated.sequence([
				Animated.timing(fadeAnim, {
					toValue: 0.3,
					duration: animDuration / 2,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(fadeAnim, {
					toValue: maxOpacity,
					duration: animDuration / 2,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
			]),
		)
		anim.start()
		return () => anim.reset()
	}, [fadeAnim, state])
	return (
		<Animated.View style={[utfIconContainerStyle, { opacity: fadeAnim }]}>
			<Text style={utfIconStyle}>{icon}</Text>
		</Animated.View>
	)
})

export const ToolsList: React.FC<{ searchText: string }> = React.memo(({ searchText }) => {
	const { navigate } = useAppNavigation()
	const modulesClient = useLabsModulesClient()

	const [goModules] = useAsyncTransform(async () => {
		if (!modulesClient) {
			return
		}
		const mods = await grpcPromise(modulesClient, 'allModules', new blmod.AllModulesRequest())
		return mods?.getModulesList()
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
				let iconUTF = 'H'
				const pbInfo: blmod.ModuleInfo.AsObject = JSON.parse(jsonData)
				if (pbInfo.iconKind !== blmod.ModuleInfo.IconKind.ICON_KIND_UTF) {
					console.warn('only utf icon supported')
				} else {
					let data = pbInfo.iconData
					if (typeof data === 'string') {
						data = base64.encode(data)
					}
					iconUTF = new TextDecoder().decode(data)
				}
				const info: HTMLModule = {
					name: mod,
					displayName: pbInfo.displayName,
					shortDescription: pbInfo.shortDescription,
					iconKind: 'UTF',
					iconUTF,
				}
				return info
			} catch (err) {
				const info: HTMLModule = { name: mod, infoError: err }
				return info
			}
		})
		console.log('html mods infos:', infos)
		return infos
	})

	const items = React.useMemo<ToolItemParams[]>(() => {
		return [
			{
				key: 'rn-ipfs-web-ui',
				title: 'IPFS Web Interface',
				desc: 'Inspect IPFS node and network',
				onPress: () => navigate('IPFSWebUI'),
				avatar: <IPFSIcon width={iconsSize} height={iconsSize} />,
			},
			{
				key: 'rn-ipfs-node-manager',
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
				key: 'rn-labs-services-health',
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
				key: 'rn-p2p-browser',
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
				key: 'rn-ipfs-node-logs',
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
					key: 'html-' + modInfo.name,
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
				if (mod.getIconKind() === blmod.ModuleInfo.IconKind.ICON_KIND_UTF) {
					try {
						const utf8Decoder = new TextDecoder('utf-8')
						console.log('decoding', mod.getIconData())
						const modIcon = utf8Decoder.decode(mod.getIconData_asU8())
						console.log('icon', modIcon)
						if (modIcon) {
							icon = modIcon
						}
					} catch (err) {
						console.warn('failed to decode icon:', err)
					}
				}
				return {
					key: mod.getName(),
					title: mod.getDisplayName(),
					desc: mod.getShortDescription(),
					onPress: () =>
						navigate('GoModule', { name: mod.getName(), displayName: mod.getDisplayName() }),
					avatar: <GoModuleAvatar name={mod.getName()} icon={icon} />,
				}
			}),
			{
				key: 'rn-ipfs-gateways-race',
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
				key: 'rn-art-collection',
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
