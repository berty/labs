import React from 'react'
import { grpc } from '@improbable-eng/grpc-web'

import { start } from 'react-native-labs-bridge'
import { blmod, ipfsman } from '@berty-labs/api'

type LabsBridgeClients = {
	blmod: blmod.LabsModulesService
	ipfsman: ipfsman.IPFSManagerService
}

type LabsBridgeState =
	| ['starting', undefined, undefined]
	| ['up', LabsBridgeClients, undefined]
	| ['error', undefined, unknown]

const ipfsmanRPC = new ipfsman.GrpcWebImpl('http://127.0.0.1:9315', {
	// Only necessary for tests running on node. Remove the
	// transport config when actually using in the browser.
	transport: grpc.WebsocketTransport(),
	debug: __DEV__,
	// metadata: new grpc.Metadata({ SomeHeader: 'bar' }),
})

const blmodRPC = new blmod.GrpcWebImpl('http://127.0.0.1:9315', {
	// Only necessary for tests running on node. Remove the
	// transport config when actually using in the browser.
	transport: grpc.WebsocketTransport(),
	debug: __DEV__,
	// metadata: new grpc.Metadata({ SomeHeader: 'bar' }),
})

export const useLabsBridgeState = () => {
	const [state, setState] = React.useState<LabsBridgeState>(['starting', undefined, undefined])
	React.useEffect(() => {
		const ac = new AbortController()
		start()
			.then((started: boolean) => {
				if (started) {
					console.log('started labs bridge')
				}
				if (ac.signal.aborted) {
					return
				}
				const clients: LabsBridgeClients = {
					blmod: new blmod.LabsModulesServiceClientImpl(blmodRPC),
					ipfsman: new ipfsman.IPFSManagerServiceClientImpl(ipfsmanRPC),
				}
				setState(['up', clients, undefined])
			})
			.catch((err: unknown) => {
				if (ac.signal.aborted) {
					return
				}
				setState(['error', undefined, err])
			})
		return () => ac.abort()
	}, [])
	return state
}

export const useIPFSManagerClient = () => {
	const [, clients] = useLabsBridgeState()
	return clients?.ipfsman
}

export const useLabsModulesClient = () => {
	const [, clients] = useLabsBridgeState()
	return clients?.blmod
}
