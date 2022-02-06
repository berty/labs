/* eslint-disable */
import Long from "long";
import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { BrowserHeaders } from "browser-headers";

export const protobufPackage = "ipfsman.v1";

export interface StartNodeRequest {
  repoPath: string;
}

export interface StartNodeResponse {
  id: string;
  apiMaddrs: string[];
  gatewayMaddrs: string[];
}

export interface StopNodeRequest {
  id: string;
}

export interface StopNodeResponse {}

function createBaseStartNodeRequest(): StartNodeRequest {
  return { repoPath: "" };
}

export const StartNodeRequest = {
  encode(
    message: StartNodeRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.repoPath !== "") {
      writer.uint32(10).string(message.repoPath);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartNodeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartNodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.repoPath = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartNodeRequest {
    return {
      repoPath: isSet(object.repoPath) ? String(object.repoPath) : "",
    };
  },

  toJSON(message: StartNodeRequest): unknown {
    const obj: any = {};
    message.repoPath !== undefined && (obj.repoPath = message.repoPath);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StartNodeRequest>, I>>(
    object: I
  ): StartNodeRequest {
    const message = createBaseStartNodeRequest();
    message.repoPath = object.repoPath ?? "";
    return message;
  },
};

function createBaseStartNodeResponse(): StartNodeResponse {
  return { id: "", apiMaddrs: [], gatewayMaddrs: [] };
}

export const StartNodeResponse = {
  encode(
    message: StartNodeResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    for (const v of message.apiMaddrs) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.gatewayMaddrs) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartNodeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartNodeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.apiMaddrs.push(reader.string());
          break;
        case 4:
          message.gatewayMaddrs.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartNodeResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      apiMaddrs: Array.isArray(object?.apiMaddrs)
        ? object.apiMaddrs.map((e: any) => String(e))
        : [],
      gatewayMaddrs: Array.isArray(object?.gatewayMaddrs)
        ? object.gatewayMaddrs.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: StartNodeResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    if (message.apiMaddrs) {
      obj.apiMaddrs = message.apiMaddrs.map((e) => e);
    } else {
      obj.apiMaddrs = [];
    }
    if (message.gatewayMaddrs) {
      obj.gatewayMaddrs = message.gatewayMaddrs.map((e) => e);
    } else {
      obj.gatewayMaddrs = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StartNodeResponse>, I>>(
    object: I
  ): StartNodeResponse {
    const message = createBaseStartNodeResponse();
    message.id = object.id ?? "";
    message.apiMaddrs = object.apiMaddrs?.map((e) => e) || [];
    message.gatewayMaddrs = object.gatewayMaddrs?.map((e) => e) || [];
    return message;
  },
};

function createBaseStopNodeRequest(): StopNodeRequest {
  return { id: "" };
}

export const StopNodeRequest = {
  encode(
    message: StopNodeRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StopNodeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStopNodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StopNodeRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
    };
  },

  toJSON(message: StopNodeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StopNodeRequest>, I>>(
    object: I
  ): StopNodeRequest {
    const message = createBaseStopNodeRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseStopNodeResponse(): StopNodeResponse {
  return {};
}

export const StopNodeResponse = {
  encode(
    _: StopNodeResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StopNodeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStopNodeResponse();
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

  fromJSON(_: any): StopNodeResponse {
    return {};
  },

  toJSON(_: StopNodeResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StopNodeResponse>, I>>(
    _: I
  ): StopNodeResponse {
    const message = createBaseStopNodeResponse();
    return message;
  },
};

export interface IPFSManagerService {
  StartNode(
    request: DeepPartial<StartNodeRequest>,
    metadata?: grpc.Metadata
  ): Promise<StartNodeResponse>;
  StopNode(
    request: DeepPartial<StopNodeRequest>,
    metadata?: grpc.Metadata
  ): Promise<StopNodeResponse>;
}

export class IPFSManagerServiceClientImpl implements IPFSManagerService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.StartNode = this.StartNode.bind(this);
    this.StopNode = this.StopNode.bind(this);
  }

  StartNode(
    request: DeepPartial<StartNodeRequest>,
    metadata?: grpc.Metadata
  ): Promise<StartNodeResponse> {
    return this.rpc.unary(
      IPFSManagerServiceStartNodeDesc,
      StartNodeRequest.fromPartial(request),
      metadata
    );
  }

  StopNode(
    request: DeepPartial<StopNodeRequest>,
    metadata?: grpc.Metadata
  ): Promise<StopNodeResponse> {
    return this.rpc.unary(
      IPFSManagerServiceStopNodeDesc,
      StopNodeRequest.fromPartial(request),
      metadata
    );
  }
}

export const IPFSManagerServiceDesc = {
  serviceName: "ipfsman.v1.IPFSManagerService",
};

export const IPFSManagerServiceStartNodeDesc: UnaryMethodDefinitionish = {
  methodName: "StartNode",
  service: IPFSManagerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return StartNodeRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...StartNodeResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const IPFSManagerServiceStopNodeDesc: UnaryMethodDefinitionish = {
  methodName: "StopNode",
  service: IPFSManagerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return StopNodeRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...StopNodeResponse.decode(data),
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
