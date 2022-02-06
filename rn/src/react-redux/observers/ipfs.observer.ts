import {
	setPersistedIPFSNodeName,
	ipfsNodeStarted,
	ipfsNodeStopped,
	startIPFSNode,
	observeStore,
} from '@berty-labs/redux'
import { randomCarretName } from '@berty-labs/reactutil'
import { store } from '@berty-labs/redux'
import { ipfsman } from '@berty-labs/api'
import { ipfsRepoPath } from '@berty-labs/ipfsutil'

const ipfsNodes: { [key: string]: string | undefined } = {}

const startNode = async (
	client: ipfsman.IPFSManagerService,
	stor: typeof store,
	ac: AbortController,
	nextNode: string,
) => {
	let ipfs: string | undefined
	let state: 'init' | 'started' = 'init'
	if (ipfsNodes[nextNode]) {
		throw new Error('already started')
	}
	try {
		// Create instance of IPFS. Use one instance per app.
		console.log('starting ipfs node', nextNode)
		const startNodeReply = await client.StartNode({
			repoPath: ipfsRepoPath(nextNode),
		})
		console.log('started ipfs node', nextNode)
		ipfs = startNodeReply.id
		state = 'started'
		console.log(ipfs)

		// Update state
		// FIXME: really parse maddr
		if (ac.signal.aborted) {
			throw new Error('abort')
		}
		const gaParts = startNodeReply.gatewayMaddrs[0].split('/')
		const gatewayURL = `http://${gaParts[2]}:${gaParts[4]}`
		const aaParts = startNodeReply.apiMaddrs[0].split('/')
		const apiURL = `http://${aaParts[2]}:${aaParts[4]}`
		ipfsNodes[nextNode] = ipfs
		stor.dispatch(ipfsNodeStarted({ nodeName: nextNode, gatewayURL, apiURL }))
	} catch (err) {
		console.warn('failed to fully start ipfs node', nextNode, err)
		if (ipfs && state === 'started') {
			try {
				console.log('stopping ipfs node', nextNode)
				await client.StopNode({ id: ipfs })
			} catch (err) {
				console.warn('failed to stop node:', err)
			}
		}
	}
}

const stopNode = async (
	client: ipfsman.IPFSManagerService,
	stor: typeof store,
	nodeName: string,
) => {
	const node = ipfsNodes[nodeName]
	if (!node) {
		return
	}
	delete ipfsNodes[nodeName]
	try {
		console.log('stopping ipfs node', nodeName)
		await client.StopNode({ id: node })
	} catch (err) {
		console.warn('failed to stop node:', err)
	}
	stor.dispatch(ipfsNodeStopped(nodeName))
}

export const observeIPFS = (client: ipfsman.IPFSManagerService) => {
	let inited = false
	return observeStore((store, prev, next) => {
		if (!inited && (next as any)?._persist.rehydrated && next.ipfsVolatile.status === 'down') {
			console.log('starting initial node')
			inited = true
			store.dispatch(startIPFSNode(next.ipfs.nodeName || randomCarretName()))
			return
		}

		const nextNodeName = next.ipfsVolatile.nodeName
		if (nextNodeName && next.ipfs.nodeName !== nextNodeName) {
			console.log('updating persisted node name')
			store.dispatch(setPersistedIPFSNodeName(nextNodeName))
		}

		if (
			(prev?.ipfsVolatile.status === undefined ||
				prev?.ipfsVolatile.status === 'down' ||
				prev?.ipfsVolatile.status === 'unloading') &&
			next.ipfsVolatile.status === 'loading'
		) {
			startNode(client, store, new AbortController(), next.ipfsVolatile.nextNodeName)
			return
		}

		if (prev?.ipfsVolatile.status === 'up' && next.ipfsVolatile.status === 'unloading') {
			stopNode(client, store, prev.ipfsVolatile.nodeName)
			return
		}
	})
}
