import React from 'react'
import { Text } from 'react-native'
import { WebView } from 'react-native-webview'

import { useGomobileIPFS } from '@berty-labs/ipfsutil'
import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { AppScreenContainer, LoaderScreen } from '@berty-labs/components'

export const IPFSWebUI: ScreenFC<'IPFSWebUI'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const [loadedLocal, setLoadedLocal] = React.useState<number>()
	const [localError, setLocalError] = React.useState<Error>()
	const [imageURI, setImageURI] = React.useState<string>()
	React.useEffect(() => {
		if (!mobileIPFS.gatewayURL) {
			return
		}
		const controller = new AbortController()
		const start = async () => {
			const url = `${mobileIPFS.gatewayURL}/ipfs/bafybeihcyruaeza7uyjd6ugicbcrqumejf6uf353e5etdkhotqffwtguva`
			try {
				console.log('pre-fetching:', url)
				const reply = await fetch(url, { signal: controller.signal })
				if (!(reply.status === 200)) {
					setLoadedLocal(Date.now())
					setLocalError(new Error(`bad reply status: ${reply.status}`))
					console.warn(`pre-fetch: bad reply status: ${reply.status}: ${url}`)
					return
				}
				console.log('pre-fetched:', url)
				setImageURI(url)
				setLoadedLocal(Date.now())
			} catch (err: unknown) {
				if (controller.signal.aborted) {
					console.log('pre-fetch abort:', url)
					return
				}
				console.warn(`pre-fetch: ${err}: ${url}`)
				setLoadedLocal(Date.now())
				setLocalError(err instanceof Error ? err : new Error(`${err}`))
			}
		}
		start()
		return () => {
			controller.abort()
		}
	}, [mobileIPFS.gatewayURL])
	if (!loadedLocal) {
		return <LoaderScreen text='Loading interface from IPFS...' />
	}
	if (localError) {
		return (
			<AppScreenContainer>
				<Text style={{ color: defaultColors.white }}>{`${localError}`}</Text>
			</AppScreenContainer>
		)
	}
	return (
		<AppScreenContainer>
			<WebView
				style={{ backgroundColor: defaultColors.background }}
				source={{
					uri: imageURI || '',
				}}
				containerStyle={{ backgroundColor: defaultColors.background }}
				onError={err => {
					setLoadedLocal(Date.now())
					setLocalError(err instanceof Error ? err : new Error(`${err}`))
				}}
			/>
		</AppScreenContainer>
	)
}
