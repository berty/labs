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
import { grpcPromise } from '@berty-labs/grpcutil'

const ipfsNodes: { [key: string]: string | undefined } = {}

const startNode = async (
	client: ipfsman.IPFSManagerServiceClient,
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
		const req = new ipfsman.StartNodeRequest()
		req.setRepoPath(ipfsRepoPath(nextNode))
		const startNodeReply = await grpcPromise(client, 'startNode', req)
		if (!startNodeReply) {
			throw new Error('emply reply')
		}
		console.log('started ipfs node', nextNode)
		ipfs = startNodeReply.getId()
		state = 'started'
		console.log(ipfs)

		// Update state
		// FIXME: really parse maddr
		if (ac.signal.aborted) {
			throw new Error('abort')
		}
		const gaMaddrs = startNodeReply.getGatewayMaddrsList()
		if (gaMaddrs.length < 1) {
			throw new Error('missing gateway address')
		}
		const apiMaddrs = startNodeReply.getApiMaddrsList()
		if (apiMaddrs.length < 1) {
			throw new Error('missing api address')
		}
		const gaParts = gaMaddrs[0].split('/')
		const gatewayURL = `http://${gaParts[2]}:${gaParts[4]}`
		const apiParts = apiMaddrs[0].split('/')
		const apiURL = `http://${apiParts[2]}:${apiParts[4]}`
		ipfsNodes[nextNode] = ipfs
		stor.dispatch(ipfsNodeStarted({ nodeName: nextNode, gatewayURL, apiURL }))
	} catch (err) {
		console.warn('failed to fully start ipfs node', nextNode, err)
		if (ipfs && state === 'started') {
			console.log('stopping ipfs node', nextNode)
			try {
				const req = new ipfsman.StopNodeRequest()
				req.setId(nextNode)
				await grpcPromise(client, 'stopNode', req)
			} catch (err) {
				console.warn('failed to stop node:', err)
			}
			stor.dispatch(ipfsNodeStopped(nextNode))
		}
	}
}

const stopNode = async (
	client: ipfsman.IPFSManagerServiceClient,
	stor: typeof store,
	nodeName: string,
) => {
	const node = ipfsNodes[nodeName]
	if (!node) {
		return
	}
	delete ipfsNodes[nodeName]
	console.log('stopping ipfs node', nodeName)
	const req = new ipfsman.StopNodeRequest()
	req.setId(node)
	try {
		await grpcPromise(client, 'stopNode', req)
	} catch (err) {
		console.warn('failed to stop node:', err)
	}
	stor.dispatch(ipfsNodeStopped(nodeName))
}

export const observeIPFS = (client: ipfsman.IPFSManagerServiceClient) => {
	let inited = false
	return observeStore((store, prev, next) => {
		if (!(next as any)?._persist.rehydrated) {
			return
		}

		if (!inited && next.ipfsVolatile.status === 'down') {
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
