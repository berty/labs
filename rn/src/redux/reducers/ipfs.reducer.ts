import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 *
 * State
 *
 */

export const ipfsSliceName = 'ipfs'

const makeRoot = <T>(val: T) => ({
	[ipfsSliceName]: val,
})

export type IPFSState = { nodeName?: string }

const newIPFSState = (): IPFSState => ({})

const initialState = newIPFSState()

type LocalState = typeof initialState
const rootInitialState = makeRoot(initialState)
type LocalRootState = typeof rootInitialState

/**
 *
 * Selectors
 *
 */

const selectSlice = (state: LocalRootState) => state[ipfsSliceName]

export const selectPersistedIPFSNodeName = (state: LocalRootState) => selectSlice(state).nodeName

/**
 *
 * Actions
 *
 */

const slice = createSlice({
	name: ipfsSliceName,
	initialState,
	reducers: {
		setPersistedIPFSNodeName(state: LocalState, { payload }: PayloadAction<string>) {
			if (!payload) {
				return
			}
			state.nodeName = payload
		},
	},
})

export const { setPersistedIPFSNodeName } = slice.actions

export default makeRoot(slice.reducer)
