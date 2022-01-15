import * as FileSystem from 'expo-file-system'

import { IPFSConfig } from '@berty-labs/ipfsutil'

export const ipfsRepoPath = (name: string) => FileSystem.documentDirectory + 'ipfs-repos/' + name

export const ipfsConfigPath = (name: string) =>
	FileSystem.documentDirectory + 'ipfs-repos/' + name + '/config'

export const getIPFSConfigOffline = async (name: string): Promise<IPFSConfig> => {
	const path = ipfsConfigPath(name)
	const configString = await FileSystem.readAsStringAsync(path)
	return JSON.parse(configString)
}
