import {
	setPersistedIPFSNodeName,
	ipfsNodeStarted,
	ipfsNodeStopped,
	startIPFSNode,
	observeStore,
} from '@berty-labs/redux'
import { IPFS } from 'react-native-gomobile-ipfs'
import { randomCarretName } from '@berty-labs/reactutil'
import { store } from '@berty-labs/redux'

const defaultGatewayMaddr = '/ip4/127.0.0.1/tcp/4242'

const ipfsNodes: { [key: string]: IPFS | undefined } = {}

const startNode = async (
	stor: typeof store,
	ac: AbortController,
	nextNode: string,
	gatewayMaddr: string,
) => {
	let ipfs: IPFS | undefined
	let state: 'init' | 'created' | 'started' = 'init'
	try {
		// Create instance of IPFS. Use one instance per app.
		console.log('creating ipfs node', nextNode)
		ipfs = await IPFS.create('ipfs-repos/' + nextNode)
		state = 'created'
		if (ac.signal.aborted) {
			throw new Error('abort')
		}
		console.log(ipfs)

		// Start IPFS instance. It will connect to the network.
		console.log('starting ipfs node', nextNode)
		await ipfs.start()
		state = 'started'
		if (ac.signal.aborted) {
			throw new Error('abort')
		}
		console.log('started ipfs node', nextNode)

		// Serve API
		const finalAPIMaddr = await ipfs.serveAPI('5001')
		console.log('ipfs api:', finalAPIMaddr)
		if (ac.signal.aborted) {
			throw new Error('abort')
		}

		// Serve gateway
		const finalGatewayMaddr = await ipfs.serveGateway(gatewayMaddr)
		console.log('ipfs gateway:', finalGatewayMaddr)
		if (ac.signal.aborted) {
			throw new Error('abort')
		}

		// Update state
		// FIXME: really parse maddr
		const gaParts = finalGatewayMaddr.split('/')
		const gatewayURL = `http://${gaParts[2]}:${gaParts[4]}`
		const aaParts = finalAPIMaddr.split('/')
		const apiURL = `http://${aaParts[2]}:${aaParts[4]}`
		if (ipfsNodes[nextNode]) {
			throw new Error('already started')
		}
		ipfsNodes[nextNode] = ipfs
		stor.dispatch(ipfsNodeStarted({ nodeName: nextNode, gatewayURL, apiURL }))
	} catch (err) {
		console.warn('failed to fully start ipfs node', nextNode, err)
		if (state === 'started') {
			try {
				console.log('stopping ipfs node', nextNode)
				await ipfs?.stop()
			} catch (err) {
				console.warn('failed to stop node:', err)
			}
		}
		if (state === 'started' || state === 'created') {
			try {
				console.log('freeing ipfs node', nextNode)
				await ipfs?.free()
			} catch (err) {
				console.warn('failed to free node:', err)
			}
		}
	}
}

const stopNode = async (stor: typeof store, nodeName: string) => {
	const node = ipfsNodes[nodeName]
	if (!node) {
		return
	}
	delete ipfsNodes[nodeName]
	try {
		console.log('stopping ipfs node', nodeName)
		await node.stop()
	} catch (err) {
		console.warn('failed to stop node:', err)
	}
	try {
		console.log('freeing ipfs node', nodeName)
		await node.free()
	} catch (err) {
		console.warn('failed to free node:', err)
	}
	stor.dispatch(ipfsNodeStopped(nodeName))
}

observeStore((store, prev, next) => {
	if (
		!(prev as any)?._persist.rehydrated &&
		(next as any)?._persist.rehydrated &&
		next.ipfsVolatile.status === 'down'
	) {
		store.dispatch(startIPFSNode(next.ipfs.nodeName || randomCarretName()))
		return
	}

	const nextNodeName = next.ipfsVolatile.nodeName
	if (nextNodeName && next.ipfs.nodeName !== nextNodeName) {
		store.dispatch(setPersistedIPFSNodeName(nextNodeName))
	}

	if (
		(prev?.ipfsVolatile.status === 'down' || prev?.ipfsVolatile.status === 'unloading') &&
		next.ipfsVolatile.status === 'loading'
	) {
		startNode(store, new AbortController(), next.ipfsVolatile.nextNodeName, defaultGatewayMaddr)
		return
	}

	if (prev?.ipfsVolatile.status === 'up' && next.ipfsVolatile.status === 'unloading') {
		stopNode(store, prev.ipfsVolatile.nodeName)
		return
	}
})
