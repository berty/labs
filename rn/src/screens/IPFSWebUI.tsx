import React from 'react'
import { Text } from 'react-native'
import { WebView } from 'react-native-webview'

import { useGomobileIPFS } from '@berty-labs/react-redux'
import { ScreenFC } from '@berty-labs/navigation'
import { defaultColors } from '@berty-labs/styles'
import { AppScreenContainer, LoaderScreen } from '@berty-labs/components'
import { useAsyncEffect } from '@berty-labs/reactutil'

export const IPFSWebUI: ScreenFC<'IPFSWebUI'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const [loadedLocal, setLoadedLocal] = React.useState<number>()
	const [localError, setLocalError] = React.useState<Error>()
	const [imageURI, setImageURI] = React.useState<string>()
	useAsyncEffect(
		async ac => {
			const url = `${mobileIPFS.gatewayURL}/ipfs/bafybeihcyruaeza7uyjd6ugicbcrqumejf6uf353e5etdkhotqffwtguva`
			try {
				console.log('pre-fetching:', url)
				const reply = await fetch(url, { signal: ac.signal })
				if (ac.signal.aborted) {
					throw new Error('abort')
				}
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
				if (ac.signal.aborted) {
					console.log('pre-fetch abort:', url)
					return
				}
				console.warn(`pre-fetch: ${err}: ${url}`)
				setLoadedLocal(Date.now())
				setLocalError(err instanceof Error ? err : new Error(`${err}`))
			}
		},
		[mobileIPFS.gatewayURL],
	)
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
