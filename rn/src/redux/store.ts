import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, PersistorOptions } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

import ipfsRootReducer, { ipfsSliceName } from './reducers/ipfs.reducer'
import ipfsVolatileRootReducer from './reducers/ipfsVolatile.reducer'
import onboardingRootReducer, { onboardingSliceName } from './reducers/onboarding.reducer'

const persistConfig = {
	key: 'persistStore',
	storage: AsyncStorage,
	whitelist: [onboardingSliceName, ipfsSliceName],
}

const rootReducer = combineReducers({
	...onboardingRootReducer,
	...ipfsRootReducer,
	...ipfsVolatileRootReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const resetStore = () => ({ type: 'RESET' })

const resettableReducer: typeof persistedReducer = (state, action, ...other) => {
	if (action.type === 'RESET') {
		return persistedReducer(undefined, action)
	}
	return persistedReducer(state, action, ...other)
}

export const store = configureStore({
	reducer: resettableReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})

export const persistor = persistStore(store, {} as PersistorOptions)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export function observeStore(
	onChange: (str: typeof store, currentState: RootState | undefined, nextState: RootState) => void,
) {
	let currentState: RootState | undefined

	function handleChange() {
		let nextState = store.getState()
		if (nextState !== currentState) {
			onChange(store, currentState, nextState)
			currentState = nextState
		}
	}

	let unsubscribe = store.subscribe(handleChange)
	handleChange()
	return unsubscribe
}
