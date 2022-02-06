import { createSlice } from '@reduxjs/toolkit'

/**
 *
 * State
 *
 */

export const onboardingSliceName = 'onboarding'

const makeRoot = <T>(val: T) => ({
	[onboardingSliceName]: val,
})

export type OnboardingState = {
	onboarded?: boolean
}

const newOnboardingState = (): OnboardingState => ({})

const initialState = newOnboardingState()

type LocalState = typeof initialState
const rootInitialState = makeRoot(initialState)
type LocalRootState = typeof rootInitialState

/**
 *
 * Selectors
 *
 */

const selectSlice = (state: LocalRootState) => state[onboardingSliceName]

export const selectOnboarded = (state: LocalRootState) => selectSlice(state).onboarded

/**
 *
 * Actions
 *
 */

const slice = createSlice({
	name: onboardingSliceName,
	initialState,
	reducers: {
		onboarded(state: LocalState) {
			console.log('did onboard')
			state.onboarded = true
		},
	},
})

export const { onboarded } = slice.actions

export default makeRoot(slice.reducer)
