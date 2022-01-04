import { NativeModules } from 'react-native';
import * as base64 from "base64-js";

const { GomobileIpfs } = NativeModules;

export var RequestOption;
(function (RequestOption) {
  RequestOption[RequestOption['Bool'] = 'b'] = 'Bool';
  RequestOption[RequestOption['String'] = 's'] = 'String';
  RequestOption[RequestOption['Bytes'] = 'd'] = 'Bytes';
})(RequestOption || (RequestOption = {}));


export var RequestBody;
(function (RequestBody) {
  RequestBody[RequestBody['String'] = 's'] = 'String';
  RequestBody[RequestBody['Bytes'] = 'd'] = 'Bytes';
})(RequestBody || (RequestBody = {}));

export class RequestBuilder {
  constructor(ptr) {
    this._ptr = ptr;
  }

  async withArgument(argument) {
    const ptr = await GomobileIpfs.requestBuilderWithArgument(this._ptr, argument);
    this._ptr = null;
    return new RequestBuilder(ptr);
  }

  async withOption(option, type, value) {
    if (type === RequestOption.Bytes) {
      value = base64.fromByteArray(value);
    }
    const ptr = await GomobileIpfs.requestBuilderWithOption(this._ptr, option, type, value);
    this._ptr = null;
    return new RequestBuilder(ptr);
  }

  async withBody(type, body) {
    if (type === RequestBody.Bytes) {
      body = base64.fromByteArray(body);
    }
    const ptr = await GomobileIpfs.requestBuilderWithBody(this._ptr, type, body);
    this._ptr = null;
    return new RequestBuilder(ptr);
  }

  async withHeader(header, value) {
    const ptr = await GomobileIpfs.requestBuilderWithHeader(this._ptr, header, value);
    this._ptr = null;
    return new RequestBuilder(ptr);
  }

  async send() {
    const res = await GomobileIpfs.requestBuilderSend(this._ptr);
    return base64.toByteArray(res);
  }

  sendToDict() {
    return GomobileIpfs.requestBuilderSendToDict(this._ptr);
  }

  async free() {
    const res = await GomobileIpfs.requestBuilderFree(this._ptr);
    this._ptr = null;
    return res;
  }
}

export class IPFS {
  constructor(ptr) {
    this._ptr = ptr;
  }

  static async create(repoPath, internalStorage) {
    if (!repoPath) {
      repoPath = IPFS.defaultRepoPath;
    }
    if (typeof internalStorage !== 'boolean') {
      internalStorage = true
    }
    const ptr = await GomobileIpfs.ipfsCreate(repoPath, internalStorage);
    return new IPFS(ptr);
  }

  static setDNSPair(primary, secondary) {
    return GomobileIpfs.ipfsSetDNSPair(primary, secondary);
  }

  start() {
    return GomobileIpfs.ipfsStart(this._ptr);
  }

  stop() {
    return GomobileIpfs.ipfsStop(this._ptr);
  }

  restart() {
    return GomobileIpfs.ipfsRestart(this._ptr);
  }

  isStarted() {
    return GomobileIpfs.ipfsIsStarted(this._ptr);
  }

  getConfig() {
    return GomobileIpfs.ipfsGetConfig(this._ptr);
  }

  setConfig(config) {
    return GomobileIpfs.ipfsSetConfig(this._ptr, config);
  }

  getConfigKey(key) {
    return GomobileIpfs.ipfsGetConfigKey(this._ptr, key);
  }

  setConfigKey(key, value) {
    return GomobileIpfs.ipfsSetConfigKey(this._ptr, key, value);
  }

  enablePubsubExperiment() {
    return GomobileIpfs.ipfsEnablePubsubExperiment(this._ptr);
  }

  enableNamesysPubsub() {
    return GomobileIpfs.ipfsEnableNamesysPubsub(this._ptr);
  }

  getAbsoluteRepoPath() {
    return GomobileIpfs.ipfsGetAbsoluteRepoPath(this._ptr);
  }

  async newRequest(command) {
    const ptr = await GomobileIpfs.ipfsNewRequest(this._ptr, command);
    return new RequestBuilder(ptr);
  }

  async free() {
    const res = await GomobileIpfs.ipfsFree(this._ptr);
    this._ptr = null;
    return res;
  }
}

IPFS.defaultRepoPath = "ipfs/repo";