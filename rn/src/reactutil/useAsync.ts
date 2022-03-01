import React from 'react'

export const useAsyncTransform = <
	TF extends (ac: AbortController) => Promise<any>,
	RT = TF extends (ac: AbortController) => Promise<infer RT> ? RT : never,
	P = TF extends (ac: AbortController, ...args: infer P) => Promise<any> ? P : never,
>(
	transformFunc: TF,
	args?: P extends any[] ? P : never,
) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memoizedTransform = React.useMemo(() => transformFunc, args || [])
	const [result, setResult] = React.useState<
		[RT, boolean, undefined] | [undefined, boolean, unknown]
	>([undefined, true, undefined])
	React.useEffect(() => {
		setResult([undefined, true, undefined])
		const ac = new AbortController()
		const start = async () => {
			if (ac.signal.aborted) {
				return
			}
			try {
				const ret = await memoizedTransform(ac)
				if (ac.signal.aborted) {
					return
				}
				setResult([ret, false, undefined])
			} catch (err) {
				if (ac.signal.aborted) {
					return
				}
				setResult([undefined, false, err])
			}
		}
		start()
		return () => {
			ac.abort()
			setResult([undefined, false, undefined])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [memoizedTransform, ...(args || [])])
	return result
}

export const useAsyncEffect = <
	EF extends (ac: AbortController) => Promise<void>,
	P = EF extends (ac: AbortController, ...args: infer P) => Promise<any> ? P : never,
>(
	effectFunc: EF,
	args?: P extends any[] ? P : never,
): [boolean, unknown] => {
	const [, running, err] = useAsyncTransform(effectFunc, args)
	return [running, err]
}
