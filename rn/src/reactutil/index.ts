import React from 'react'

export * from './randomName'
export * from './useAsync'

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (effect: React.EffectCallback) => React.useEffect(effect, [])

export const useUnmountRef = () => {
	const unmountRef = React.useRef(false)
	useMountEffect(() => {
		return () => {
			unmountRef.current = true
		}
	})
	return unmountRef
}

export const prettyMilliSeconds = (ms: number) => {
	if (ms >= 60000) {
		return `${(ms / 60000).toFixed(0)}min ${((ms % 60000) / 1000).toFixed(0)}sec`
	}
	if (ms >= 1000) {
		return `${(ms / 1000).toFixed(2)}sec`
	}
	return `${ms}ms`
}

export const prettyBytes = (rb: number | null | undefined) => {
	const b = rb || 0
	if (b < 1000) {
		return `${b.toFixed(2)} B`
	}
	if (b < 1000000) {
		return `${(b / 1000).toFixed(2)} kB`
	}
	if (b < 1000000000) {
		return `${(b / 1000000).toFixed(2)} MB`
	}
}
