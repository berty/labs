import React from 'react'
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	FlatList,
	Dimensions,
	useWindowDimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { defaultColors } from '@berty-labs/styles'
import { useGomobileIPFS } from '@berty-labs/react-redux'
import { ScreenFC } from '@berty-labs/navigation'
import { AppScreenContainer, Loader, LoaderScreen } from '@berty-labs/components'
import { useAsyncTransform } from '@berty-labs/reactutil'

const rektCollectionRoot = '/ipfs/QmZdUpu5sC2YPKBdocZqYtLyy2DSBD6WLK7STKFQoDgbYW/metadata'
// const externalGateway = 'https://gateway.pinata.cloud'

const fetchURL = async (url: string, controller: AbortController) => {
	console.log('fetching:', url)
	let reply = await fetch(url, { signal: controller.signal })
	//console.log('fetch:', reply.status)
	if (!(reply.status === 200)) {
		throw new Error(`bad http status: ${reply.status}`)
	}
	return reply
}

const ArtPiece: React.FC<{
	index: number
	item: string
}> = ({ index, item }) => {
	const mobileIPFS = useGomobileIPFS()

	const windowSize = Dimensions.get('window')
	const insets = useSafeAreaInsets()
	const sizeImg = Math.min(
		windowSize.width - 30,
		windowSize.height - (90 + insets.bottom + insets.top),
	)

	const [info] = useAsyncTransform(
		async controller => {
			try {
				if (!mobileIPFS.gatewayURL) {
					return
				}
				// fetch ipfs json file
				const fileReply = await fetchURL(mobileIPFS.gatewayURL + item, controller)
				if (controller.signal.aborted) {
					throw new Error('abort')
				}
				const usableReply = await fileReply.text()
				if (controller.signal.aborted) {
					throw new Error('abort')
				}
				const parsedUsableReply = JSON.parse(usableReply)
				const regex = /\/ipfs\/.+?\/image\/[0-9]+.png/g
				// recup image
				const uriFinal = parsedUsableReply.image.match(regex)
				// fetch image
				const nftReply = await fetchURL(mobileIPFS.gatewayURL + uriFinal, controller)
				if (controller.signal.aborted) {
					throw new Error('abort')
				}
				return {
					uri: nftReply.url,
					name: parsedUsableReply.name,
					desc: parsedUsableReply.description,
				}
			} catch (err: unknown) {
				if (controller.signal.aborted) {
					console.log('fetch-art abort:', item, err)
					return
				}
				console.warn('fetch-art error:', err)
			}
		},
		[item, mobileIPFS.gatewayURL],
	)

	if (!mobileIPFS.gatewayURL) {
		return <LoaderScreen text='Waiting for IPFS node...' />
	}

	return (
		<View
			style={{
				alignItems: 'center',
				justifyContent: 'flex-start',
				width: windowSize.width,
				paddingHorizontal: 15,
				marginTop: 30,
			}}
		>
			{info?.uri && info?.name ? (
				<>
					<Text
						selectable={true}
						style={{
							fontSize: 30,
							fontFamily: 'Open Sans',
							color: defaultColors.text,
							marginBottom: 30,
						}}
						numberOfLines={1}
					>
						{info.name}
					</Text>
					<Image
						key={index}
						style={{ width: sizeImg, height: sizeImg, marginBottom: 30 }}
						source={{ uri: info?.uri }}
						onError={({ nativeEvent: { error } }) => console.warn('failed to load image:', error)}
					/>
					<Text
						selectable={true}
						style={{
							opacity: 0.7,
							fontSize: 15,
							fontFamily: 'Open Sans',
							color: defaultColors.text,
							marginBottom: 30,
							textAlign: 'justify',
						}}
					>
						{info.desc}
					</Text>
				</>
			) : (
				<View style={{ height: sizeImg + 150, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator />
				</View>
			)}
		</View>
	)
}

export const ArtCollection: ScreenFC<'ArtCollection'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const winsz = useWindowDimensions()

	const [ipfsFiles] = useAsyncTransform(
		async (ac: AbortController) => {
			if (!mobileIPFS.gatewayURL) {
				return
			}
			// fetch ipfs directory
			const ipfsDirReply = await fetchURL(mobileIPFS.gatewayURL + rektCollectionRoot, ac)
			if (ac.signal.aborted) {
				throw new Error('abort')
			}
			const usableReply = await ipfsDirReply.text()
			if (ac.signal.aborted) {
				throw new Error('abort')
			}
			const regex = /\/ipfs\/.+?\/metadata\/[0-9]+/g
			// recup ipfs json files
			const files = usableReply.match(regex)
			if (!files) {
				throw new Error('no files')
			}
			return files
		},
		[mobileIPFS.gatewayURL],
	)

	return (
		<AppScreenContainer>
			<FlatList
				showsVerticalScrollIndicator={false}
				style={{ alignContent: 'center', marginTop: 20 }}
				ListHeaderComponent={() => (
					<View style={{ width: winsz.width, alignItems: 'center', justifyContent: 'center' }}>
						<View
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								width: winsz.width,
								flexDirection: 'row',
							}}
						>
							<Text
								style={{
									fontSize: 80,
									color: defaultColors.text,
									marginTop: 30,
									marginBottom: 30,
								}}
							>
								REKT
							</Text>
						</View>
						{!ipfsFiles?.length && <Loader text='Loading list from IPFS...' />}
					</View>
				)}
				contentContainerStyle={{ alignItems: 'flex-start' }}
				data={ipfsFiles}
				renderItem={({ item, index }) => <ArtPiece item={item} index={index} />}
			/>
		</AppScreenContainer>
	)
}
