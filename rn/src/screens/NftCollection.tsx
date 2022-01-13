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
import { AppScreenContainer, Loader } from '@berty-labs/components'
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

const NFT: React.FC<{
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

	const [nft] = useAsyncTransform(
		async controller => {
			try {
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
				// recup nft image
				const uriFinal = parsedUsableReply.image.match(regex)
				// fetch nft image
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
					console.log('fetch-nft abort:', item, err)
					return
				}
				console.warn('fetch-nft error:', err)
			}
		},
		[item, mobileIPFS.gatewayURL],
	)

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
			{nft?.uri && nft?.name ? (
				<>
					<Text
						selectable={true}
						style={{
							fontSize: 30,
							fontFamily: 'Open Sans',
							color: defaultColors.white,
							marginBottom: 30,
						}}
						numberOfLines={1}
					>
						{nft.name}
					</Text>
					<Image
						key={index}
						style={{ width: sizeImg, height: sizeImg, marginBottom: 30 }}
						source={{ uri: nft?.uri }}
						onError={({ nativeEvent: { error } }) => console.warn('failed to load image:', error)}
					/>
					<Text
						selectable={true}
						style={{
							opacity: 0.7,
							fontSize: 15,
							fontFamily: 'Open Sans',
							color: defaultColors.white,
							marginBottom: 30,
							textAlign: 'justify',
						}}
					>
						{nft.desc}
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

export const NftCollection: ScreenFC<'NftCollection'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const winsz = useWindowDimensions()

	const [ipfsFiles] = useAsyncTransform(
		async (ac: AbortController) => {
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
									color: defaultColors.white,
									marginTop: 30,
									marginBottom: 30,
								}}
							>
								REKT
							</Text>
						</View>
						{!ipfsFiles?.length && <Loader text='Loading NFT list from IPFS...' />}
					</View>
				)}
				contentContainerStyle={{ alignItems: 'flex-start' }}
				data={ipfsFiles}
				renderItem={({ item, index }) => <NFT item={item} index={index} />}
			/>
		</AppScreenContainer>
	)
}
