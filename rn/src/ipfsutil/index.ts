import { useMountEffect } from '@berty-labs/reactutil'
import React from 'react'
import { IPFS } from 'react-native-gomobile-ipfs'

export type GomobileIPFSState =
	| {
			state: 'loading'
			ipfs?: undefined
			gatewayURL?: undefined
	  }
	| {
			state: 'up'
			ipfs: IPFS
			gatewayURL: string
	  }

const loadingState: GomobileIPFSState = { state: 'loading' }

export type GomobileIPFSOptions = {
	gatewayMaddr?: string
}

export const useGomobileIPFS = (
	path = 'ipfs-repos/default-0',
	opts?: GomobileIPFSOptions,
): GomobileIPFSState => {
	const [state, setState] = React.useState<GomobileIPFSState>(loadingState)
	const gatewayMaddr = opts?.gatewayMaddr || '/ip4/127.0.0.1/tcp/4242'

	useMountEffect(() => {
		let canceled = false
		let clean = async () => {}
		const start = async () => {
			// Create instance of IPFS. Use one instance per app.
			console.log('creating ipfs node')
			const ipfs = await IPFS.create(path)
			if (canceled) {
				console.log('cancel 0')
				ipfs.free()
				return
			}
			console.log(ipfs)

			// Start IPFS instance. It will connect to the network.
			console.log('starting ipfs node')
			await ipfs.start()
			clean = async () => {
				console.log('stoping ipfs node')
				await ipfs.stop()
				console.log('freeing ipfs node')
				await ipfs.free()
				console.log('ipfs node free')
			}
			if (canceled) {
				await clean()
				console.log('cancel 1')
				return
			}
			console.log('started ipfs node')

			// Serve gateway
			const finalGatewayMaddr = await ipfs.serveGateway(gatewayMaddr)
			console.log('ipfs gateway:', gatewayMaddr)
			if (canceled) {
				console.log('cancel 2')
				return
			}

			// Update state
			// FIXME: really parse maddr
			const gaParts = finalGatewayMaddr.split('/')
			const gatewayURL = `http://${gaParts[2]}:${gaParts[4]}`
			setState({ gatewayURL, ipfs, state: 'up' })
		}
		start()
		return () => {
			canceled = true
			clean()
		}
	})

	return state
}
