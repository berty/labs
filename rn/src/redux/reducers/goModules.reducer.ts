import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 *
 * State
 *
 */

export const goModulesSliceName = 'goModules'

const makeRoot = <T>(val: T) => ({
	[goModulesSliceName]: val,
})

export type ModuleState = {
	name: string
	args: string
	state: 'error' | 'running' | 'idle'
	text: string
	error: string
}

const moduleAdapter = createEntityAdapter<ModuleState>({
	selectId: ({ name }) => name,
})
const moduleSelectors = moduleAdapter.getSelectors()

const initialState = moduleAdapter.getInitialState()

type LocalState = typeof initialState
const rootInitialState = makeRoot(initialState)
type LocalRootState = typeof rootInitialState

/**
 *
 * Selectors
 *
 */

const selectSlice = (state: LocalRootState) => state[goModulesSliceName]

export const selectModuleState = (state: LocalRootState, name: string) =>
	moduleSelectors.selectById(selectSlice(state), name) || {
		name,
		state: 'idle',
		text: '',
		error: '',
		args: '',
	}

// export const selectOnboarded = (state: LocalRootState) => selectSlice(state).onboarded

/**
 *
 * Actions
 *
 */

const slice = createSlice({
	name: goModulesSliceName,
	initialState,
	reducers: {
		runModule(state: LocalState, { payload: { name } }: PayloadAction<{ name: string }>) {
			const existing = moduleSelectors.selectById(state, name)
			if (existing) {
				if (existing.state === 'idle' || existing.state === 'error') {
					moduleAdapter.updateOne(state, {
						id: name,
						changes: {
							state: 'running',
							text: '',
							error: '',
						},
					})
				}
			} else {
				moduleAdapter.addOne(state, {
					name,
					state: 'running',
					text: '',
					error: '',
					args: '',
				})
			}
		},
		addModuleText(
			state: LocalState,
			{ payload: { name, text } }: PayloadAction<{ name: string; text: string }>,
		) {
			const existing = moduleSelectors.selectById(state, name)
			if (existing?.state === 'running') {
				moduleAdapter.updateOne(state, {
					id: name,
					changes: {
						text: existing.text + text,
					},
				})
			}
		},
		moduleFailed(
			state: LocalState,
			{ payload: { name, error } }: PayloadAction<{ name: string; error: string }>,
		) {
			if (moduleSelectors.selectById(state, name)) {
				moduleAdapter.updateOne(state, {
					id: name,
					changes: {
						state: 'error',
						error,
					},
				})
			} else {
				moduleAdapter.addOne(state, {
					name,
					state: 'error',
					text: '',
					error,
					args: '',
				})
			}
		},
		moduleDone(state: LocalState, { payload: { name } }: PayloadAction<{ name: string }>) {
			const existing = moduleSelectors.selectById(state, name)
			if (existing) {
				if (existing.state === 'running') {
					moduleAdapter.updateOne(state, {
						id: name,
						changes: {
							state: 'idle',
						},
					})
				}
			} else {
				moduleAdapter.addOne(state, {
					name,
					state: 'idle',
					text: '',
					error: '',
					args: '',
				})
			}
		},
		setModuleArgs(
			state: LocalState,
			{ payload: { name, args } }: PayloadAction<{ name: string; args: string }>,
		) {
			const existing = moduleSelectors.selectById(state, name)
			if (existing) {
				moduleAdapter.updateOne(state, {
					id: name,
					changes: {
						args,
					},
				})
			} else {
				moduleAdapter.addOne(state, {
					name,
					state: 'idle',
					text: '',
					error: '',
					args: args,
				})
			}
		},
	},
})

export const { runModule, addModuleText, moduleFailed, moduleDone, setModuleArgs } = slice.actions

export default makeRoot(slice.reducer)
