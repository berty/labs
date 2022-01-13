import React, { useContext } from 'react'
import { IPFS } from 'react-native-gomobile-ipfs'
import * as FileSystem from 'expo-file-system'

import { IPFSConfig } from './config'

export type GomobileIPFSState = GomobileIPFSInternalState & {
	switchToNode: (name: string) => Promise<void>
}

export type GomobileIPFSInternalState =
	| {
			state: 'loading'
			ipfs?: undefined
			gatewayURL?: undefined
			apiURL?: undefined
			name?: undefined
	  }
	| {
			state: 'up'
			ipfs: IPFS
			gatewayURL: string
			apiURL: string
			name: string
	  }
	| {
			state: 'unloading'
			ipfs?: undefined
			gatewayURL?: undefined
			apiURL?: undefined
			name?: undefined
	  }

export type GomobileIPFSOptions = {
	gatewayMaddr?: string
}

const loadingState: GomobileIPFSState = { state: 'loading', switchToNode: async () => {} }

const GomobileIPFSContext = React.createContext<GomobileIPFSState>(loadingState)

// let nodeState: GomobileIPFSState | undefined

export const useGomobileIPFSNode = (
	name = 'default-0',
	opts?: GomobileIPFSOptions,
): GomobileIPFSState => {
	const [state, setState] = React.useState<GomobileIPFSInternalState>(loadingState)
	const [nextNode, setNextNode] = React.useState<string>(name)
	const gatewayMaddr = opts?.gatewayMaddr || '/ip4/127.0.0.1/tcp/4242'

	const switchToNode = React.useCallback(
		async (newName: string) => {
			if (state.state !== 'up') {
				return
			}
			setState({ ...state, state: 'unloading' } as any)
			if (!state.ipfs) {
				return
			}
			console.log('stoping ipfs node', state.name)
			await state.ipfs.stop()
			console.log('freeing ipfs node', state.name)
			await state.ipfs.free()
			setNextNode(newName)
		},
		[state],
	)

	React.useEffect(() => {
		/*if (nodeState) {
			setState(nodeState)
			return
		}*/
		let canceled = false
		let clean = async () => {}
		const start = async () => {
			// Create instance of IPFS. Use one instance per app.
			console.log('creating ipfs node', nextNode)
			const ipfs = await IPFS.create('ipfs-repos/' + nextNode)
			if (canceled) {
				console.log('cancel 0')
				await ipfs.free()
				return
			}
			console.log(ipfs)

			// Start IPFS instance. It will connect to the network.
			console.log('starting ipfs node', nextNode)
			await ipfs.start()
			clean = async () => {
				/*console.log('stoping ipfs node')
                await ipfs.stop()
                console.log('freeing ipfs node')
                await ipfs.free()
                console.log('ipfs node free')*/
			}
			if (canceled) {
				await clean()
				console.log('cancel 1')
				return
			}
			console.log('started ipfs node', nextNode)

			// Serve API
			const finalAPIMaddr = await ipfs.serveAPI('5001')
			console.log('ipfs api:', finalAPIMaddr)
			if (canceled) {
				console.log('cancel 2')
				return
			}

			// Serve gateway
			const finalGatewayMaddr = await ipfs.serveGateway(gatewayMaddr)
			console.log('ipfs gateway:', finalGatewayMaddr)
			if (canceled) {
				console.log('cancel 2')
				return
			}

			// Update state
			// FIXME: really parse maddr
			const gaParts = finalGatewayMaddr.split('/')
			const gatewayURL = `http://${gaParts[2]}:${gaParts[4]}`
			const aaParts = finalAPIMaddr.split('/')
			const apiURL = `http://${aaParts[2]}:${aaParts[4]}`
			const st: GomobileIPFSInternalState = {
				gatewayURL,
				apiURL,
				ipfs,
				state: 'up',
				name: nextNode,
			}
			//nodeState = st
			setState(st)
		}
		start()
		return () => {
			canceled = true
			clean()
		}
	}, [nextNode, gatewayMaddr])

	return React.useMemo(() => ({ ...state, switchToNode }), [state, switchToNode])
}

export const GomobileIPFSProvider: React.FC = ({ children }) => {
	const state = useGomobileIPFSNode()
	return <GomobileIPFSContext.Provider value={state}>{children}</GomobileIPFSContext.Provider>
}

export const useGomobileIPFS = () => {
	return useContext(GomobileIPFSContext)
}

export const ipfsRepoPath = (name: string) => FileSystem.documentDirectory + 'ipfs-repos/' + name

export const ipfsConfigPath = (name: string) =>
	FileSystem.documentDirectory + 'ipfs-repos/' + name + '/config'

export const getIPFSConfigOffline = async (name: string): Promise<IPFSConfig> => {
	const path = ipfsConfigPath(name)
	const configString = await FileSystem.readAsStringAsync(path)
	return JSON.parse(configString)
}
