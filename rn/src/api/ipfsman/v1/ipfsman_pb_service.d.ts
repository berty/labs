/* eslint-disable no-dupe-class-members */
// package: ipfsman.v1
// file: ipfsman/v1/ipfsman.proto

import * as ipfsman_v1_ipfsman_pb from '../../ipfsman/v1/ipfsman_pb'
import { grpc } from '@improbable-eng/grpc-web'

type IPFSManagerServiceStartNode = {
	readonly methodName: string
	readonly service: typeof IPFSManagerService
	readonly requestStream: false
	readonly responseStream: false
	readonly requestType: typeof ipfsman_v1_ipfsman_pb.StartNodeRequest
	readonly responseType: typeof ipfsman_v1_ipfsman_pb.StartNodeResponse
}

type IPFSManagerServiceStopNode = {
	readonly methodName: string
	readonly service: typeof IPFSManagerService
	readonly requestStream: false
	readonly responseStream: false
	readonly requestType: typeof ipfsman_v1_ipfsman_pb.StopNodeRequest
	readonly responseType: typeof ipfsman_v1_ipfsman_pb.StopNodeResponse
}

export class IPFSManagerService {
	static readonly serviceName: string
	static readonly StartNode: IPFSManagerServiceStartNode
	static readonly StopNode: IPFSManagerServiceStopNode
}

export type ServiceError = { message: string; code: number; metadata: grpc.Metadata }
export type Status = { details: string; code: number; metadata: grpc.Metadata }

interface UnaryResponse {
	cancel(): void
}
interface ResponseStream<T> {
	cancel(): void
	on(type: 'data', handler: (message: T) => void): ResponseStream<T>
	on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>
	on(type: 'status', handler: (status: Status) => void): ResponseStream<T>
}
interface RequestStream<T> {
	write(message: T): RequestStream<T>
	end(): void
	cancel(): void
	on(type: 'end', handler: (status?: Status) => void): RequestStream<T>
	on(type: 'status', handler: (status: Status) => void): RequestStream<T>
}
interface BidirectionalStream<ReqT, ResT> {
	write(message: ReqT): BidirectionalStream<ReqT, ResT>
	end(): void
	cancel(): void
	on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>
	on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>
	on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>
}

export class IPFSManagerServiceClient {
	readonly serviceHost: string

	constructor(serviceHost: string, options?: grpc.RpcOptions)
	startNode(
		requestMessage: ipfsman_v1_ipfsman_pb.StartNodeRequest,
		metadata: grpc.Metadata,
		callback: (
			error: ServiceError | null,
			responseMessage: ipfsman_v1_ipfsman_pb.StartNodeResponse | null,
		) => void,
	): UnaryResponse
	startNode(
		requestMessage: ipfsman_v1_ipfsman_pb.StartNodeRequest,
		callback: (
			error: ServiceError | null,
			responseMessage: ipfsman_v1_ipfsman_pb.StartNodeResponse | null,
		) => void,
	): UnaryResponse
	stopNode(
		requestMessage: ipfsman_v1_ipfsman_pb.StopNodeRequest,
		metadata: grpc.Metadata,
		callback: (
			error: ServiceError | null,
			responseMessage: ipfsman_v1_ipfsman_pb.StopNodeResponse | null,
		) => void,
	): UnaryResponse
	stopNode(
		requestMessage: ipfsman_v1_ipfsman_pb.StopNodeRequest,
		callback: (
			error: ServiceError | null,
			responseMessage: ipfsman_v1_ipfsman_pb.StopNodeResponse | null,
		) => void,
	): UnaryResponse
}
