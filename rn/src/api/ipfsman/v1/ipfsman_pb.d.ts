// package: ipfsman.v1
// file: ipfsman/v1/ipfsman.proto

import * as jspb from 'google-protobuf'

export class StartNodeRequest extends jspb.Message {
	getRepoPath(): string
	setRepoPath(value: string): void

	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): StartNodeRequest.AsObject
	static toObject(includeInstance: boolean, msg: StartNodeRequest): StartNodeRequest.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: StartNodeRequest, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): StartNodeRequest
	static deserializeBinaryFromReader(
		message: StartNodeRequest,
		reader: jspb.BinaryReader,
	): StartNodeRequest
}

export namespace StartNodeRequest {
	export type AsObject = {
		repoPath: string
	}
}

export class StartNodeResponse extends jspb.Message {
	getId(): string
	setId(value: string): void

	clearApiMaddrsList(): void
	getApiMaddrsList(): Array<string>
	setApiMaddrsList(value: Array<string>): void
	addApiMaddrs(value: string, index?: number): string

	clearGatewayMaddrsList(): void
	getGatewayMaddrsList(): Array<string>
	setGatewayMaddrsList(value: Array<string>): void
	addGatewayMaddrs(value: string, index?: number): string

	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): StartNodeResponse.AsObject
	static toObject(includeInstance: boolean, msg: StartNodeResponse): StartNodeResponse.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: StartNodeResponse, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): StartNodeResponse
	static deserializeBinaryFromReader(
		message: StartNodeResponse,
		reader: jspb.BinaryReader,
	): StartNodeResponse
}

export namespace StartNodeResponse {
	export type AsObject = {
		id: string
		apiMaddrsList: Array<string>
		gatewayMaddrsList: Array<string>
	}
}

export class StopNodeRequest extends jspb.Message {
	getId(): string
	setId(value: string): void

	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): StopNodeRequest.AsObject
	static toObject(includeInstance: boolean, msg: StopNodeRequest): StopNodeRequest.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: StopNodeRequest, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): StopNodeRequest
	static deserializeBinaryFromReader(
		message: StopNodeRequest,
		reader: jspb.BinaryReader,
	): StopNodeRequest
}

export namespace StopNodeRequest {
	export type AsObject = {
		id: string
	}
}

export class StopNodeResponse extends jspb.Message {
	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): StopNodeResponse.AsObject
	static toObject(includeInstance: boolean, msg: StopNodeResponse): StopNodeResponse.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: StopNodeResponse, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): StopNodeResponse
	static deserializeBinaryFromReader(
		message: StopNodeResponse,
		reader: jspb.BinaryReader,
	): StopNodeResponse
}

export namespace StopNodeResponse {
	export type AsObject = {}
}
