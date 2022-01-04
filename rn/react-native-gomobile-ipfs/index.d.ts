export enum RequestOption {
  Bool = 'b',
  String = 's',
  Bytes = 'd'
}

export enum RequestBody {
  String = 's',
  Bytes = 'd'
}

export class RequestBuilder {
  public withArgument(argument: String): Promise<RequestBuilder>;
  public withOption(option: String, type: RequestOption.Bool, value: boolean): Promise<RequestBuilder>;
  public withOption(option: String, type: RequestOption.Bytes, value: Uint8Array): Promise<RequestBuilder>;
  public withOption(option: String, type: RequestOption.String, value: string): Promise<RequestBuilder>;
  public withBody(type: RequestBody.String, value: string): Promise<RequestBuilder>;
  public withBody(type: RequestBody.Bytes, value: Uint8Array): Promise<RequestBuilder>;
  public withHeader(header: string, value: string): Promise<RequestBuilder>;

  public send(): Promise<Uint8Array>;
  public sendToDict(): Promise<Record<string, any>>;
  
  public free(): Promise<void>;
}

export class IPFS {
  public static defaultRepoPath: string;

  public static setDNSPair(primary: string, secondary: string): Promise<void>;

  public static create(repoPath?: string, internalStorage?: boolean): Promise<IPFS>;

  public start(): Promise<void>;
  public stop(): Promise<void>;
  public restart(): Promise<void>;

  public enablePubsubExperiment(): Promise<void>;
  public enableNamesysPubsub(): Promise<void>;

  public isStarted(): Promise<boolean>;

  public getConfig(): Promise<Record<string, any>>;
  public getConfigKey(key: string): Promise<Record<string, any>>;
  public setConfig(config?: Record<string, any>): Promise<void>;
  public setConfigKey(key: string, value: Record<string, any>): Promise<void>;

  public getAbsoluteRepoPath(): Promise<string>;

  public newRequest(command: string): Promise<RequestBuilder>;

  public free(): Promise<void>;
}