import React, { useContext } from 'react'
import { IPFS } from 'react-native-gomobile-ipfs'
import { create, IPFSHTTPClient } from 'ipfs-http-client'

import { useMountEffect } from '@berty-labs/reactutil'

export type GomobileIPFSState =
	| {
			state: 'loading'
			ipfs?: undefined
			gatewayURL?: undefined
			apiURL?: undefined
	  }
	| {
			state: 'up'
			ipfs: IPFS
			gatewayURL: string
			apiURL: string
	  }

export type GomobileIPFSOptions = {
	gatewayMaddr?: string
}

const loadingState: GomobileIPFSState = { state: 'loading' }

const GomobileIPFSContext = React.createContext<GomobileIPFSState>(loadingState)

let nodeState: GomobileIPFSState | undefined

export const useGomobileIPFSNode = (
	path = 'ipfs-repos/default-0',
	opts?: GomobileIPFSOptions,
): GomobileIPFSState => {
	const [state, setState] = React.useState<GomobileIPFSState>(loadingState)
	const gatewayMaddr = opts?.gatewayMaddr || '/ip4/127.0.0.1/tcp/4242'

	useMountEffect(() => {
		if (nodeState) {
			setState(nodeState)
			return
		}
		let canceled = false
		let clean = async () => {}
		const start = async () => {
			// Create instance of IPFS. Use one instance per app.
			console.log('creating ipfs node')
			const ipfs = await IPFS.create(path)
			if (canceled) {
				console.log('cancel 0')
				await ipfs.free()
				return
			}
			console.log(ipfs)

			// Start IPFS instance. It will connect to the network.
			console.log('starting ipfs node')
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
			console.log('started ipfs node')

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
			const st: GomobileIPFSState = { gatewayURL, apiURL, ipfs, state: 'up' }
			nodeState = st
			setState(st)
		}
		start()
		return () => {
			canceled = true
			clean()
		}
	})

	return state
}

export const GomobileIPFSProvider: React.FC = ({ children }) => {
	const state = useGomobileIPFSNode()
	return <GomobileIPFSContext.Provider value={state}>{children}</GomobileIPFSContext.Provider>
}

export const useGomobileIPFS = () => {
	return useContext(GomobileIPFSContext)
}

// IPFSHTTPClient

export type IPFSHTTPClientState = {
	client?: IPFSHTTPClient
}

const IPFSHTTPClientContext = React.createContext<IPFSHTTPClientState>({})

export const useIPFSHTTP = () => {
	const [state, setState] = React.useState<IPFSHTTPClientState>({})

	useMountEffect(() => {
		let canceled = false
		let clean = async () => {}
		const start = () => {
			const client = create({ url: 'http://127.0.0.1:5001', apiPath: 'api/v0' })
			if (canceled) {
				clean()
				return
			}
			setState({ client })
		}
		start()
		return () => {
			canceled = true
			clean()
		}
	})

	return state
}

export const IPFSHttpClientProvider: React.FC = ({ children }) => {
	const state = useIPFSHTTP()
	return <IPFSHTTPClientContext.Provider value={state}>{children}</IPFSHTTPClientContext.Provider>
}
