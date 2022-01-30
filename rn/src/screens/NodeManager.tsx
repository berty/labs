import React from 'react'
import { ActivityIndicator, FlatList, Text, TextInput, TextStyle, View } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { useFocusEffect } from '@react-navigation/native'

import { ScreenFC, useAppNavigation } from '@berty-labs/navigation'
import {
	AppScreenContainer,
	Button,
	Card,
	LoaderScreen,
	UseIPFSNodeButton,
} from '@berty-labs/components'
import { prettyBytes, useUnmountRef, randomCarretName } from '@berty-labs/reactutil'
import { defaultColors } from '@berty-labs/styles'
import { ipfsRepoPath } from '@berty-labs/ipfsutil'
import { usePathSize } from '@berty-labs/expoutil'
import { useGomobileIPFS } from '@berty-labs/react-redux'

type RepoInfo = {
	name: string
	path: string
	size: number | undefined
	modificationTime: number | undefined
}

const space = 15

const textStyle: TextStyle = { color: defaultColors.white, opacity: 0.7, fontSize: 15 }
const titleStyle: TextStyle = {
	color: defaultColors.white,
	fontSize: 30,
	marginTop: 30,
	marginBottom: 15,
}

const NodeItem: React.FC<{
	item: RepoInfo
	refresh: (controller: AbortController) => Promise<void>
}> = ({ item, refresh }) => {
	const { navigate } = useAppNavigation()
	const mobileIPFS = useGomobileIPFS()
	const size = usePathSize(ipfsRepoPath(item.name))
	const isInUse = mobileIPFS.nodeName === item.name || mobileIPFS.nextNodeName === item.name
	return (
		<Card style={{ marginTop: space }} title={item.name}>
			<Text style={[textStyle, { marginBottom: space }]}>Size: {prettyBytes(size)}</Text>
			<View style={{ flexDirection: 'row' }}>
				<UseIPFSNodeButton
					nodeName={item.name}
					style={{ marginRight: space }}
					onUse={() => navigate('NodeConfig', { name: item.name })}
				/>
				<Button
					title='More'
					shrink
					onPress={() => navigate('NodeConfig', { name: item.name })}
					style={{ marginRight: space }}
				/>
				{!isInUse && (
					<Button
						title='Delete'
						shrink
						onPress={() => {
							const start = async () => {
								await FileSystem.deleteAsync(ipfsRepoPath(item.name))
								await refresh(new AbortController())
							}
							start()
						}}
					/>
				)}
			</View>
		</Card>
	)
}

const keyExtractor = (item: RepoInfo) => item.path

export const NodeManager: ScreenFC<'NodeManager'> = ({ navigation: { navigate } }) => {
	const [repoInfo, setRepoInfo] = React.useState<RepoInfo[]>()
	const [isCreating, setIsCreating] = React.useState(false)
	const refresh = React.useCallback(async (controller: AbortController) => {
		const repos = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + '/ipfs-repos')
		const reposInfos: RepoInfo[] = []
		for (const repo of repos) {
			const repoPath = FileSystem.documentDirectory + 'ipfs-repos/' + repo
			const info = await FileSystem.getInfoAsync(repoPath)
			if (controller.signal.aborted) {
				return
			}
			reposInfos.push({
				name: repo,
				path: repoPath,
				size: info.size,
				modificationTime: info.modificationTime,
			})
		}
		if (controller.signal.aborted) {
			return
		}
		setRepoInfo(reposInfos)
	}, [])
	const unmountRef = useUnmountRef()
	useFocusEffect(() => {
		const controller = new AbortController()
		refresh(controller)
		return () => controller.abort()
	})
	const mobileIpfs = useGomobileIPFS()
	const selected = repoInfo?.find(r => r.name === mobileIpfs.nodeName || mobileIpfs.nextNodeName)
	const selectable = (
		selected ? repoInfo?.filter(r => keyExtractor(r) !== keyExtractor(selected)) : repoInfo
	)?.sort((a, b) => (b?.modificationTime || 0) - (a?.modificationTime || 0))
	const [newNodeName, setNewNodeName] = React.useState(randomCarretName())
	if (!repoInfo) {
		return <LoaderScreen text='Loading nodes list...' />
	}
	return (
		<AppScreenContainer>
			<View style={{ padding: 15, paddingTop: 0, flex: 1 }}>
				<FlatList
					ListHeaderComponent={
						<View>
							<Text style={titleStyle}>💚 Current node</Text>
							{!!selected && <NodeItem item={selected} refresh={refresh} />}
							<Text style={titleStyle}>🏗️ Create node</Text>
							<Card style={{ marginTop: 15 }}>
								<TextInput
									autoCorrect={false}
									autoCapitalize='none'
									style={{
										fontSize: 25,
										marginBottom: 15,
										color: defaultColors.white,
										paddingVertical: 10,
										borderRadius: 6,
										paddingHorizontal: 15,
										backgroundColor: defaultColors.white + '07',
										width: '100%',
									}}
									placeholder='Type the new node name'
									onChangeText={setNewNodeName}
									value={newNodeName}
								/>
								<View style={{ flexDirection: 'row' }}>
									<Button
										shrink
										disabled={!newNodeName || isCreating}
										title='Create'
										onPress={() => {
											setIsCreating(true)
											const start = async () => {
												try {
													const repoPath = ipfsRepoPath(newNodeName)
													await FileSystem.makeDirectoryAsync(repoPath)
													navigate('NodeConfig', { name: newNodeName })
													await refresh(new AbortController())
													setNewNodeName(randomCarretName())
												} catch (err) {
													console.warn(`failed to create IPFS node ${newNodeName}: ${err}`)
												}
												if (unmountRef.current) {
													return
												}
											}
											setIsCreating(false)
											start()
										}}
									/>
									{isCreating && <ActivityIndicator style={{ marginLeft: 15 }} />}
								</View>
							</Card>
							<Text style={titleStyle}>💤 {selectable?.length || 0} inactive nodes</Text>
						</View>
					}
					data={selectable}
					renderItem={({ item }) => <NodeItem item={item} refresh={refresh} />}
					keyExtractor={keyExtractor}
				/>
			</View>
		</AppScreenContainer>
	)
}
