import React from 'react'
import * as FileSystem from 'expo-file-system'

export const usePathSize = (path: string) => {
	const [size, setSize] = React.useState<number>()

	const updateSize = React.useCallback(
		async (controller: AbortController) => {
			const info = await FileSystem.getInfoAsync(path)
			if (controller.signal.aborted) {
				return
			}
			setSize(info.size)
		},
		[path],
	)

	React.useEffect(() => {
		const controller = new AbortController()
		updateSize(controller)
		const interval = setInterval(() => {
			updateSize(controller)
		}, 1000)
		return () => {
			controller.abort()
			clearInterval(interval)
		}
	}, [updateSize])

	return size
}
