// DTS path-map shim only; source still imports 'resty-client' at runtime.

type HttpMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

export interface RequestOptions {
  url?: string;
  method?: HttpMethod;
  baseURL?: string;
  headers?: any;
  params?: any;
  data?: any;
  timeout?: number;
  /** resty-client restful path params */
  rest?: Record<string, any>;
  [key: string]: any;
}

export interface RestyResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

type ResolvedMiddleware<T = any> = (val: T) => T | Promise<T>;
type RejectedMiddleware = (err: any) => any;

interface RestyClient {
  get<T = any>(url: string, request?: RequestOptions): Promise<RestyResponse<T>>;
  delete<T = any>(url: string, request?: RequestOptions): Promise<RestyResponse<T>>;
  post<T = any>(url: string, request?: RequestOptions): Promise<RestyResponse<T>>;
  put<T = any>(url: string, request?: RequestOptions): Promise<RestyResponse<T>>;
  patch<T = any>(url: string, request?: RequestOptions): Promise<RestyResponse<T>>;
  request<T = any>(url: string, request?: RequestOptions): Promise<RestyResponse<T>>;
}

interface RestyStatic {
  create(common?: RequestOptions, serverMap?: any, apiMap?: any): RestyClient;
  useReq(onFulfilled?: ResolvedMiddleware<RequestOptions>, onRejected?: RejectedMiddleware): void;
  useRes(onFulfilled?: ResolvedMiddleware<RestyResponse>, onRejected?: RejectedMiddleware): void;
  [key: string]: any;
}

/** Minimal default export so value imports typecheck when path-mapped for dts. */
declare const resty: RestyStatic;

export default resty;
