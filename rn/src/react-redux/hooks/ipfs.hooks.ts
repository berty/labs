import * as rv from '@berty-labs/redux/reducers/ipfsVolatile.reducer'

import { useAppSelector } from '../core'

export const useIPFSNodeName = () => {
	return useAppSelector(rv.selectIPFSNodeName)
}

export const useIPFSGatewayURL = () => {
	return useAppSelector(rv.selectIPFSGatewayURL)
}

export const useGomobileIPFS = () => {
	return useAppSelector(state => state.ipfsVolatile)
}
