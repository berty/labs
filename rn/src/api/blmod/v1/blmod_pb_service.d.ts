/* eslint-disable no-dupe-class-members */
// package: blmod.v1
// file: blmod/v1/blmod.proto

import * as blmod_v1_blmod_pb from '../../blmod/v1/blmod_pb'
import { grpc } from '@improbable-eng/grpc-web'

type LabsModulesServiceAllModules = {
	readonly methodName: string
	readonly service: typeof LabsModulesService
	readonly requestStream: false
	readonly responseStream: false
	readonly requestType: typeof blmod_v1_blmod_pb.AllModulesRequest
	readonly responseType: typeof blmod_v1_blmod_pb.AllModulesResponse
}

type LabsModulesServiceRunModule = {
	readonly methodName: string
	readonly service: typeof LabsModulesService
	readonly requestStream: true
	readonly responseStream: true
	readonly requestType: typeof blmod_v1_blmod_pb.RunModuleRequest
	readonly responseType: typeof blmod_v1_blmod_pb.RunModuleResponse
}

export class LabsModulesService {
	static readonly serviceName: string
	static readonly AllModules: LabsModulesServiceAllModules
	static readonly RunModule: LabsModulesServiceRunModule
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

export class LabsModulesServiceClient {
	readonly serviceHost: string

	constructor(serviceHost: string, options?: grpc.RpcOptions)
	allModules(
		requestMessage: blmod_v1_blmod_pb.AllModulesRequest,
		metadata: grpc.Metadata,
		callback: (
			error: ServiceError | null,
			responseMessage: blmod_v1_blmod_pb.AllModulesResponse | null,
		) => void,
	): UnaryResponse
	allModules(
		requestMessage: blmod_v1_blmod_pb.AllModulesRequest,
		callback: (
			error: ServiceError | null,
			responseMessage: blmod_v1_blmod_pb.AllModulesResponse | null,
		) => void,
	): UnaryResponse
	runModule(
		metadata?: grpc.Metadata,
	): BidirectionalStream<blmod_v1_blmod_pb.RunModuleRequest, blmod_v1_blmod_pb.RunModuleResponse>
}
