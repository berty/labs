import * as FileSystem from 'expo-file-system'

import { IPFSConfig } from '@berty-labs/ipfsutil'

export const ipfsReposRoot = FileSystem.documentDirectory + 'ipfs-repos/'

export const ipfsRepoPath = (name: string) => ipfsReposRoot + name + '/'

export const ipfsConfigPath = (name: string) => ipfsRepoPath(name) + 'config'

export const getIPFSConfigOffline = async (name: string): Promise<IPFSConfig> => {
	const path = ipfsConfigPath(name)
	const configString = await FileSystem.readAsStringAsync(path)
	return JSON.parse(configString)
}
