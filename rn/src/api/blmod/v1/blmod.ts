/* eslint-disable */
import Long from "long";
import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { BrowserHeaders } from "browser-headers";

export const protobufPackage = "blmod.v1";

export interface ModuleInfo {
  name: string;
  displayName: string;
  iconKind: ModuleInfo_IconKind;
  iconData: Uint8Array;
  shortDescription: string;
}

export enum ModuleInfo_IconKind {
  ICON_KIND_UNSPECIFIED = 0,
  ICON_KIND_UTF = 1,
  ICON_KIND_PNG = 2,
  ICON_KIND_SVG = 3,
  UNRECOGNIZED = -1,
}

export function moduleInfo_IconKindFromJSON(object: any): ModuleInfo_IconKind {
  switch (object) {
    case 0:
    case "ICON_KIND_UNSPECIFIED":
      return ModuleInfo_IconKind.ICON_KIND_UNSPECIFIED;
    case 1:
    case "ICON_KIND_UTF":
      return ModuleInfo_IconKind.ICON_KIND_UTF;
    case 2:
    case "ICON_KIND_PNG":
      return ModuleInfo_IconKind.ICON_KIND_PNG;
    case 3:
    case "ICON_KIND_SVG":
      return ModuleInfo_IconKind.ICON_KIND_SVG;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ModuleInfo_IconKind.UNRECOGNIZED;
  }
}

export function moduleInfo_IconKindToJSON(object: ModuleInfo_IconKind): string {
  switch (object) {
    case ModuleInfo_IconKind.ICON_KIND_UNSPECIFIED:
      return "ICON_KIND_UNSPECIFIED";
    case ModuleInfo_IconKind.ICON_KIND_UTF:
      return "ICON_KIND_UTF";
    case ModuleInfo_IconKind.ICON_KIND_PNG:
      return "ICON_KIND_PNG";
    case ModuleInfo_IconKind.ICON_KIND_SVG:
      return "ICON_KIND_SVG";
    default:
      return "UNKNOWN";
  }
}

export interface AllModulesRequest {}

export interface AllModulesResponse {
  modules: ModuleInfo[];
}

export interface RunModuleRequest {
  name: string;
}

export interface RunModuleResponse {
  reportKind: RunModuleResponse_ReportKind;
  reportData: Uint8Array;
}

export enum RunModuleResponse_ReportKind {
  REPORT_KIND_UNSPECIFIED = 0,
  REPORT_KIND_UTF = 1,
  REPORT_KIND_MARKDOWN = 2,
  UNRECOGNIZED = -1,
}

export function runModuleResponse_ReportKindFromJSON(
  object: any
): RunModuleResponse_ReportKind {
  switch (object) {
    case 0:
    case "REPORT_KIND_UNSPECIFIED":
      return RunModuleResponse_ReportKind.REPORT_KIND_UNSPECIFIED;
    case 1:
    case "REPORT_KIND_UTF":
      return RunModuleResponse_ReportKind.REPORT_KIND_UTF;
    case 2:
    case "REPORT_KIND_MARKDOWN":
      return RunModuleResponse_ReportKind.REPORT_KIND_MARKDOWN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RunModuleResponse_ReportKind.UNRECOGNIZED;
  }
}

export function runModuleResponse_ReportKindToJSON(
  object: RunModuleResponse_ReportKind
): string {
  switch (object) {
    case RunModuleResponse_ReportKind.REPORT_KIND_UNSPECIFIED:
      return "REPORT_KIND_UNSPECIFIED";
    case RunModuleResponse_ReportKind.REPORT_KIND_UTF:
      return "REPORT_KIND_UTF";
    case RunModuleResponse_ReportKind.REPORT_KIND_MARKDOWN:
      return "REPORT_KIND_MARKDOWN";
    default:
      return "UNKNOWN";
  }
}

function createBaseModuleInfo(): ModuleInfo {
  return {
    name: "",
    displayName: "",
    iconKind: 0,
    iconData: new Uint8Array(),
    shortDescription: "",
  };
}

export const ModuleInfo = {
  encode(
    message: ModuleInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(18).string(message.displayName);
    }
    if (message.iconKind !== 0) {
      writer.uint32(24).int32(message.iconKind);
    }
    if (message.iconData.length !== 0) {
      writer.uint32(34).bytes(message.iconData);
    }
    if (message.shortDescription !== "") {
      writer.uint32(42).string(message.shortDescription);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModuleInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModuleInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.displayName = reader.string();
          break;
        case 3:
          message.iconKind = reader.int32() as any;
          break;
        case 4:
          message.iconData = reader.bytes();
          break;
        case 5:
          message.shortDescription = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ModuleInfo {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      displayName: isSet(object.displayName) ? String(object.displayName) : "",
      iconKind: isSet(object.iconKind)
        ? moduleInfo_IconKindFromJSON(object.iconKind)
        : 0,
      iconData: isSet(object.iconData)
        ? bytesFromBase64(object.iconData)
        : new Uint8Array(),
      shortDescription: isSet(object.shortDescription)
        ? String(object.shortDescription)
        : "",
    };
  },

  toJSON(message: ModuleInfo): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.iconKind !== undefined &&
      (obj.iconKind = moduleInfo_IconKindToJSON(message.iconKind));
    message.iconData !== undefined &&
      (obj.iconData = base64FromBytes(
        message.iconData !== undefined ? message.iconData : new Uint8Array()
      ));
    message.shortDescription !== undefined &&
      (obj.shortDescription = message.shortDescription);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ModuleInfo>, I>>(
    object: I
  ): ModuleInfo {
    const message = createBaseModuleInfo();
    message.name = object.name ?? "";
    message.displayName = object.displayName ?? "";
    message.iconKind = object.iconKind ?? 0;
    message.iconData = object.iconData ?? new Uint8Array();
    message.shortDescription = object.shortDescription ?? "";
    return message;
  },
};

function createBaseAllModulesRequest(): AllModulesRequest {
  return {};
}

export const AllModulesRequest = {
  encode(
    _: AllModulesRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AllModulesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllModulesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): AllModulesRequest {
    return {};
  },

  toJSON(_: AllModulesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AllModulesRequest>, I>>(
    _: I
  ): AllModulesRequest {
    const message = createBaseAllModulesRequest();
    return message;
  },
};

function createBaseAllModulesResponse(): AllModulesResponse {
  return { modules: [] };
}

export const AllModulesResponse = {
  encode(
    message: AllModulesResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.modules) {
      ModuleInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AllModulesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllModulesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.modules.push(ModuleInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AllModulesResponse {
    return {
      modules: Array.isArray(object?.modules)
        ? object.modules.map((e: any) => ModuleInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: AllModulesResponse): unknown {
    const obj: any = {};
    if (message.modules) {
      obj.modules = message.modules.map((e) =>
        e ? ModuleInfo.toJSON(e) : undefined
      );
    } else {
      obj.modules = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AllModulesResponse>, I>>(
    object: I
  ): AllModulesResponse {
    const message = createBaseAllModulesResponse();
    message.modules =
      object.modules?.map((e) => ModuleInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRunModuleRequest(): RunModuleRequest {
  return { name: "" };
}

export const RunModuleRequest = {
  encode(
    message: RunModuleRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunModuleRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunModuleRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RunModuleRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
    };
  },

  toJSON(message: RunModuleRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RunModuleRequest>, I>>(
    object: I
  ): RunModuleRequest {
    const message = createBaseRunModuleRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseRunModuleResponse(): RunModuleResponse {
  return { reportKind: 0, reportData: new Uint8Array() };
}

export const RunModuleResponse = {
  encode(
    message: RunModuleResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.reportKind !== 0) {
      writer.uint32(8).int32(message.reportKind);
    }
    if (message.reportData.length !== 0) {
      writer.uint32(18).bytes(message.reportData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunModuleResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunModuleResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reportKind = reader.int32() as any;
          break;
        case 2:
          message.reportData = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RunModuleResponse {
    return {
      reportKind: isSet(object.reportKind)
        ? runModuleResponse_ReportKindFromJSON(object.reportKind)
        : 0,
      reportData: isSet(object.reportData)
        ? bytesFromBase64(object.reportData)
        : new Uint8Array(),
    };
  },

  toJSON(message: RunModuleResponse): unknown {
    const obj: any = {};
    message.reportKind !== undefined &&
      (obj.reportKind = runModuleResponse_ReportKindToJSON(message.reportKind));
    message.reportData !== undefined &&
      (obj.reportData = base64FromBytes(
        message.reportData !== undefined ? message.reportData : new Uint8Array()
      ));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RunModuleResponse>, I>>(
    object: I
  ): RunModuleResponse {
    const message = createBaseRunModuleResponse();
    message.reportKind = object.reportKind ?? 0;
    message.reportData = object.reportData ?? new Uint8Array();
    return message;
  },
};

export interface LabsModulesService {
  AllModules(
    request: DeepPartial<AllModulesRequest>,
    metadata?: grpc.Metadata
  ): Promise<AllModulesResponse>;
  RunModule(
    request: DeepPartial<RunModuleRequest>,
    metadata?: grpc.Metadata
  ): Promise<RunModuleResponse>;
}

export class LabsModulesServiceClientImpl implements LabsModulesService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.AllModules = this.AllModules.bind(this);
    this.RunModule = this.RunModule.bind(this);
  }

  AllModules(
    request: DeepPartial<AllModulesRequest>,
    metadata?: grpc.Metadata
  ): Promise<AllModulesResponse> {
    return this.rpc.unary(
      LabsModulesServiceAllModulesDesc,
      AllModulesRequest.fromPartial(request),
      metadata
    );
  }

  RunModule(
    request: DeepPartial<RunModuleRequest>,
    metadata?: grpc.Metadata
  ): Promise<RunModuleResponse> {
    return this.rpc.unary(
      LabsModulesServiceRunModuleDesc,
      RunModuleRequest.fromPartial(request),
      metadata
    );
  }
}

export const LabsModulesServiceDesc = {
  serviceName: "blmod.v1.LabsModulesService",
};

export const LabsModulesServiceAllModulesDesc: UnaryMethodDefinitionish = {
  methodName: "AllModules",
  service: LabsModulesServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return AllModulesRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...AllModulesResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const LabsModulesServiceRunModuleDesc: UnaryMethodDefinitionish = {
  methodName: "RunModule",
  service: LabsModulesServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return RunModuleRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...RunModuleResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR
  extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;

    debug?: boolean;
    metadata?: grpc.Metadata;
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;

      debug?: boolean;
      metadata?: grpc.Metadata;
    }
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
            ...this.options?.metadata.headersMap,
            ...metadata?.headersMap,
          })
        : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new Error(response.statusMessage) as any;
            err.code = response.status;
            err.metadata = response.trailers;
            reject(err);
          }
        },
      });
    });
  }
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
