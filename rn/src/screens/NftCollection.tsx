import React from 'react'
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	SafeAreaView,
	FlatList,
	Dimensions,
} from 'react-native'

import { defaultColors } from '@berty-labs/styles'
import { useGomobileIPFS } from '@berty-labs/ipfsutil'
import { ScreenFC } from '@berty-labs/navigation'

const superlativeRoot = '/ipfs/QmZdUpu5sC2YPKBdocZqYtLyy2DSBD6WLK7STKFQoDgbYW/metadata'
// const externalGateway = 'https://gateway.pinata.cloud'

const NFT: React.FC<{
	index: number
	item: string
	fetchURL: (
		url: string,
		canceled: boolean,
	) => Promise<Awaited<ReturnType<typeof fetch> | undefined>>
}> = ({ index, item, fetchURL }) => {
	const mobileIPFS = useGomobileIPFS()
	const [nft, setNft] = React.useState<{ uri: string; name: string; desc: string }>()

	const { width: windowWidth } = Dimensions.get('window')
	const sizeImg = windowWidth - 30

	React.useEffect(() => {
		if (!mobileIPFS.gatewayURL) {
			return
		}
		let canceled = false
		const start = async () => {
			// fetch ipfs json file
			const fileReply = await fetchURL(mobileIPFS.gatewayURL + item, canceled)
			if (!fileReply) {
				return
			}
			const usableReply = await fileReply.text()
			const parsedUsableReply = JSON.parse(usableReply)
			const regex = /\/ipfs\/.+?\/image\/[0-9]+.png/g
			// recup nft image
			const uriFinal = parsedUsableReply.image.match(regex)
			// fetch nft image
			const nftReply = await fetchURL(mobileIPFS.gatewayURL + uriFinal, canceled)
			if (!nftReply) {
				return
			}
			if (canceled) {
				return
			}
			setNft({
				uri: nftReply.url,
				name: parsedUsableReply.name,
				desc: parsedUsableReply.description,
			})
		}
		start()
		return () => {
			canceled = true
		}
	}, [fetchURL, item, mobileIPFS.gatewayURL])

	return (
		<View
			style={{
				alignItems: 'center',
				justifyContent: 'flex-start',
				width: windowWidth,
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
						onError={({ nativeEvent: { error } }) => console.warn(error)}
						onLoad={() => console.log('local image loaded')}
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
				<ActivityIndicator />
			)}
		</View>
	)
}

export const NftCollection: ScreenFC<'NftCollection'> = () => {
	const mobileIPFS = useGomobileIPFS()
	const [ipfsFiles, setIpfsFiles] = React.useState<string[]>([])

	const fetchURL = React.useCallback(async (url: string, canceled: boolean) => {
		console.log('fetching:', url)
		let reply = await fetch(url)
		console.log('fetch:', reply.status)
		if (canceled) {
			console.log('fetch canceled')
			return
		}
		if (!(reply.status === 200)) {
			console.warn('fetch fail')
			return
		}
		return reply
	}, [])

	React.useEffect(() => {
		if (!mobileIPFS.gatewayURL) {
			return
		}
		let canceled = false
		const start = async () => {
			// fetch ipfs directory
			const ipfsDirReply = await fetchURL(mobileIPFS.gatewayURL + superlativeRoot, canceled)
			if (!ipfsDirReply) {
				return
			}
			const usableReply = await ipfsDirReply.text()
			const regex = /\/ipfs\/.+?\/metadata\/[0-9]+/g
			// recup ipfs json files
			const files = usableReply.match(regex)
			if (!files) {
				return
			}
			if (canceled) {
				return
			}
			setIpfsFiles(files)
		}
		start()
		return () => {
			canceled = true
		}
	}, [fetchURL, mobileIPFS.gatewayURL])

	return (
		<SafeAreaView style={{ backgroundColor: defaultColors.background, flex: 1 }}>
			<FlatList
				showsVerticalScrollIndicator={false}
				style={{ alignContent: 'center', marginTop: 20 }}
				ListHeaderComponent={() => (
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							flexDirection: 'row',
						}}
					>
						<Text
							style={{ fontSize: 80, color: defaultColors.white, marginTop: 30, marginBottom: 30 }}
						>
							REKT
						</Text>
					</View>
				)}
				contentContainerStyle={{ alignItems: 'flex-start' }}
				data={ipfsFiles}
				renderItem={({ item, index }) => <NFT item={item} index={index} fetchURL={fetchURL} />}
			/>
		</SafeAreaView>
	)
}
