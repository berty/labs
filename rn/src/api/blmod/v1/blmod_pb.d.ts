// package: blmod.v1
// file: blmod/v1/blmod.proto

import * as jspb from 'google-protobuf'

export class ModuleInfo extends jspb.Message {
	getName(): string
	setName(value: string): void

	getDisplayName(): string
	setDisplayName(value: string): void

	getIconKind(): ModuleInfo.IconKindMap[keyof ModuleInfo.IconKindMap]
	setIconKind(value: ModuleInfo.IconKindMap[keyof ModuleInfo.IconKindMap]): void

	getIconData(): Uint8Array | string
	getIconData_asU8(): Uint8Array
	getIconData_asB64(): string
	setIconData(value: Uint8Array | string): void

	getShortDescription(): string
	setShortDescription(value: string): void

	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): ModuleInfo.AsObject
	static toObject(includeInstance: boolean, msg: ModuleInfo): ModuleInfo.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: ModuleInfo, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): ModuleInfo
	static deserializeBinaryFromReader(message: ModuleInfo, reader: jspb.BinaryReader): ModuleInfo
}

export namespace ModuleInfo {
	export type AsObject = {
		name: string
		displayName: string
		iconKind: ModuleInfo.IconKindMap[keyof ModuleInfo.IconKindMap]
		iconData: Uint8Array | string
		shortDescription: string
	}

	export interface IconKindMap {
		ICON_KIND_UNSPECIFIED: 0
		ICON_KIND_UTF: 1
		ICON_KIND_PNG: 2
		ICON_KIND_SVG: 3
	}

	export const IconKind: IconKindMap
}

export class AllModulesRequest extends jspb.Message {
	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): AllModulesRequest.AsObject
	static toObject(includeInstance: boolean, msg: AllModulesRequest): AllModulesRequest.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: AllModulesRequest, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): AllModulesRequest
	static deserializeBinaryFromReader(
		message: AllModulesRequest,
		reader: jspb.BinaryReader,
	): AllModulesRequest
}

export namespace AllModulesRequest {
	export type AsObject = {}
}

export class AllModulesResponse extends jspb.Message {
	clearModulesList(): void
	getModulesList(): Array<ModuleInfo>
	setModulesList(value: Array<ModuleInfo>): void
	addModules(value?: ModuleInfo, index?: number): ModuleInfo

	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): AllModulesResponse.AsObject
	static toObject(includeInstance: boolean, msg: AllModulesResponse): AllModulesResponse.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: AllModulesResponse, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): AllModulesResponse
	static deserializeBinaryFromReader(
		message: AllModulesResponse,
		reader: jspb.BinaryReader,
	): AllModulesResponse
}

export namespace AllModulesResponse {
	export type AsObject = {
		modulesList: Array<ModuleInfo.AsObject>
	}
}

export class RunModuleRequest extends jspb.Message {
	getName(): string
	setName(value: string): void

	getArgs(): Uint8Array | string
	getArgs_asU8(): Uint8Array
	getArgs_asB64(): string
	setArgs(value: Uint8Array | string): void

	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): RunModuleRequest.AsObject
	static toObject(includeInstance: boolean, msg: RunModuleRequest): RunModuleRequest.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: RunModuleRequest, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): RunModuleRequest
	static deserializeBinaryFromReader(
		message: RunModuleRequest,
		reader: jspb.BinaryReader,
	): RunModuleRequest
}

export namespace RunModuleRequest {
	export type AsObject = {
		name: string
		args: Uint8Array | string
	}
}

export class RunModuleResponse extends jspb.Message {
	getPayload(): Uint8Array | string
	getPayload_asU8(): Uint8Array
	getPayload_asB64(): string
	setPayload(value: Uint8Array | string): void

	serializeBinary(): Uint8Array
	toObject(includeInstance?: boolean): RunModuleResponse.AsObject
	static toObject(includeInstance: boolean, msg: RunModuleResponse): RunModuleResponse.AsObject
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
	static serializeBinaryToWriter(message: RunModuleResponse, writer: jspb.BinaryWriter): void
	static deserializeBinary(bytes: Uint8Array): RunModuleResponse
	static deserializeBinaryFromReader(
		message: RunModuleResponse,
		reader: jspb.BinaryReader,
	): RunModuleResponse
}

export namespace RunModuleResponse {
	export type AsObject = {
		payload: Uint8Array | string
	}
}
