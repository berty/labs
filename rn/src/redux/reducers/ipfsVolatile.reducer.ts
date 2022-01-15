import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 *
 * State
 *
 */

export const ipfsVolatileSliceName = 'ipfsVolatile'

const makeRoot = <T>(val: T) => ({
	[ipfsVolatileSliceName]: val,
})

export type IPFSVolatileState =
	| {
			nodeName?: undefined
			nextNodeName?: undefined
			gatewayURL?: undefined
			apiURL?: undefined
			status: 'down'
	  }
	| {
			nodeName?: undefined
			nextNodeName: string
			gatewayURL?: undefined
			apiURL?: undefined
			status: 'loading'
	  }
	| {
			nodeName: string
			nextNodeName?: undefined
			gatewayURL: string
			apiURL: string
			status: 'up'
	  }
	| {
			nodeName: string
			nextNodeName: string
			gatewayURL?: undefined
			apiURL?: undefined
			status: 'unloading'
	  }

const newIPFSState = (): IPFSVolatileState => ({
	status: 'down',
})

const initialState = newIPFSState()

type LocalState = typeof initialState
const rootInitialState = makeRoot(initialState)
type LocalRootState = typeof rootInitialState

/**
 *
 * Selectors
 *
 */

const selectSlice = (state: LocalRootState) => state[ipfsVolatileSliceName]

export const selectIPFSNodeName = (state: LocalRootState) => selectSlice(state).nodeName
export const selectIPFSGatewayURL = (state: LocalRootState) => selectSlice(state).gatewayURL

/**
 *
 * Actions
 *
 */

const slice = createSlice({
	name: ipfsVolatileSliceName,
	initialState,
	reducers: {
		startIPFSNode(state: LocalState, { payload }: PayloadAction<string>) {
			switch (state.status) {
				case 'down':
					return {
						status: 'loading',
						nextNodeName: payload,
					}
				case 'up':
					if (state.nodeName === payload) {
						return
					}
					return {
						status: 'unloading',
						nodeName: state.nodeName,
						nextNodeName: payload,
					}
				default:
					console.warn('unexpected start action while', state.status)
					return
			}
		},
		ipfsNodeStopped(state: LocalState, { payload }: PayloadAction<string>) {
			switch (state.status) {
				case 'unloading':
					if (state.nodeName !== payload) {
						return
					}
					return {
						status: 'loading',
						nextNodeName: state.nextNodeName,
					}
				default:
					console.warn('unexpected stopped action while', state.status)
					return
			}
		},
		ipfsNodeStarted(
			state: LocalState,
			{ payload }: PayloadAction<{ nodeName: string; gatewayURL: string; apiURL: string }>,
		) {
			switch (state.status) {
				case 'loading':
					if (state.nextNodeName !== payload.nodeName) {
						return
					}
					return {
						status: 'up',
						...payload,
					}
				default:
					console.warn('unexpected started action while', state.status)
					return
			}
		},
	},
})

export const { startIPFSNode, ipfsNodeStarted, ipfsNodeStopped } = slice.actions

export default makeRoot(slice.reducer)
