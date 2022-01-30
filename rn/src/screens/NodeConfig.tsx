import React, { useEffect } from 'react'
import { ScrollView, Share, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import * as FileSystem from 'expo-file-system'

import { ScreenFC } from '@berty-labs/navigation'
import {
	AnySpec,
	getIPFSConfigOffline,
	IPFSConfig,
	ipfsConfigPath,
	ipfsRepoPath,
} from '@berty-labs/ipfsutil'
import {
	AppScreenContainer,
	Button,
	Card,
	IPFSServicesHealth,
	UseIPFSNodeButton,
} from '@berty-labs/components'
import { defaultColors } from '@berty-labs/styles'
import { prettyBytes, useMountEffect } from '@berty-labs/reactutil'
import { usePathSize } from '@berty-labs/expoutil'
import { useGomobileIPFS } from '@berty-labs/react-redux'

const textStyle = { color: defaultColors.white, opacity: 0.7 }

const space = 15

const prettyDatastoreType = (name: string) => {
	switch (name) {
		case 'levelds':
			return 'LevelDB'
		case 'flatfs':
			return 'FlatFS'
		default:
			return name
	}
}

const MDNSCard: React.FC<{ config?: IPFSConfig; style?: ViewStyle }> = ({ config, style }) => {
	const enabled = config?.Discovery?.MDNS?.Enabled
	return (
		<Card title='Local peer discovery' style={style}>
			<Text style={textStyle}>
				{typeof enabled === 'boolean' ? (enabled ? 'Enabled' : 'Disabled') : 'Unknown state'}
			</Text>
			{typeof config?.Discovery?.MDNS?.Interval === 'number' && (
				<Text style={textStyle}>{config?.Discovery?.MDNS?.Interval} seconds interval</Text>
			)}
		</Card>
	)
}

export const NodeConfig: ScreenFC<'NodeConfig'> = ({
	route: {
		params: { name },
	},
}) => {
	const mobileIPFS = useGomobileIPFS()
	const [rootSpec, setRootSpec] = React.useState<AnySpec>()
	const [blocksSpec, setBlocksSpec] = React.useState<AnySpec>()
	const [config, setConfig] = React.useState<IPFSConfig>()
	const [configString, setConfigString] = React.useState<string>()
	const [showRawConfig, setShowRawConfig] = React.useState(false)
	const [isBareRepo, setIsBareRepo] = React.useState(false)
	const size = usePathSize(ipfsRepoPath(name))

	const refresh = React.useCallback(
		async (controller: AbortController) => {
			const info = await FileSystem.getInfoAsync(ipfsConfigPath(name))
			if (controller.signal.aborted) {
				return
			}
			if (!info.exists) {
				setIsBareRepo(true)
				return
			}
			setIsBareRepo(false)
			const config = await getIPFSConfigOffline(name)
			if (controller.signal.aborted) {
				return
			}
			if (config.Identity?.PrivKey) {
				delete config.Identity.PrivKey
			}
			setConfig(config)
			const prettyConfigString = JSON.stringify(config, null, 4)
			setConfigString(prettyConfigString)
			//console.log(prettyConfigString)
			// FIXME: make this recursive
			const spec = config.Datastore?.Spec
			switch (spec?.type) {
				case 'mount':
					const mounts = spec?.mounts || []
					for (const mount of mounts) {
						if (mount.mountpoint === '/') {
							let spec: AnySpec = mount
							if (mount.type === 'measure') {
								spec = mount.child
							}
							setRootSpec(spec)
							//console.log('root', mount)
						}
						if (mount.mountpoint === '/blocks') {
							let spec: AnySpec = mount
							if (mount.type === 'measure') {
								spec = mount.child
							}
							setBlocksSpec(spec)
							//console.log('blocks', mount)
						}
					}
					break
			}
		},
		[name],
	)

	useEffect(() => {
		const ac = new AbortController()
		refresh(ac)
		return () => ac.abort()
	}, [refresh, mobileIPFS.status])

	useMountEffect(() => {
		const controller = new AbortController()
		refresh(controller)
		const interval = setInterval(() => {
			refresh(controller)
		}, 4000)
		return () => {
			controller.abort()
			clearInterval(interval)
		}
	})

	const isInUse = mobileIPFS.status === 'up' && mobileIPFS.nodeName === name

	const useNodeButton = <UseIPFSNodeButton nodeName={name} style={{ marginLeft: space }} />

	return (
		<AppScreenContainer>
			<ScrollView>
				<View
					style={{
						padding: space,
						paddingBottom: 0,
						alignItems: 'flex-start',
						justifyContent: 'flex-start',
					}}
				>
					<Text style={{ color: defaultColors.white, fontSize: 3 * space, marginBottom: space }}>
						{name}
					</Text>
					{isBareRepo && (
						<View style={{ flexDirection: 'row', marginBottom: space }}>
							<Card>
								<Text style={textStyle}>Bare repository</Text>
							</Card>
							{useNodeButton}
						</View>
					)}
					{!isBareRepo && (
						<>
							<View style={{ flexDirection: 'row', marginBottom: space }}>
								<Card>
									<Text style={textStyle}>
										{typeof size === 'number' ? prettyBytes(size) : '? B'} on disk
									</Text>
								</Card>
								{useNodeButton}
							</View>
							{isInUse && <IPFSServicesHealth style={{ marginBottom: space }} />}
							<MDNSCard config={config} style={{ marginBottom: space }} />
							<Card title='Datastores' style={{ marginBottom: space }}>
								{rootSpec && (
									<Text style={textStyle}>
										The root is backed by {prettyDatastoreType(rootSpec.type)}
									</Text>
								)}
								{blocksSpec && (
									<Text style={textStyle}>
										Blocks are backed by {prettyDatastoreType(blocksSpec.type)}
									</Text>
								)}
							</Card>
							{configString && (
								<>
									<Card style={{ marginBottom: space }} title='Raw configuration'>
										<TouchableOpacity
											onPress={() => setShowRawConfig(!showRawConfig)}
											style={{ marginBottom: space }}
										>
											<Text style={textStyle}>
												{showRawConfig ? configString : 'Tap here to show the raw configuration'}
											</Text>
										</TouchableOpacity>
										<Button
											shrink
											title='Share'
											onPress={() => {
												const start = async () => {
													try {
														const conf = await getIPFSConfigOffline(name)
														if (conf?.Identity?.PrivKey) {
															delete conf.Identity.PrivKey
														}
														if (!FileSystem.cacheDirectory) {
															console.warn('no cache directory')
															return
														}
														const tmpPath = FileSystem.cacheDirectory + `${name}.ipfsconf.json`
														await FileSystem.writeAsStringAsync(
															tmpPath,
															JSON.stringify(conf, null, 4),
														)
														Share.share({ url: tmpPath })
													} catch (err) {
														console.warn('failed to share node config:', err)
													}
												}
												start()
											}}
										/>
									</Card>
								</>
							)}
						</>
					)}
				</View>
			</ScrollView>
		</AppScreenContainer>
	)
}
