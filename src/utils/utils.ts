import { AxiosHeaders, RawAxiosRequestHeaders } from 'axios';
import { version } from '../../package.json';

// 延迟
export const delayTime = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// 转为字符串
export const resolveString = (data: any) => {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.join('\n');
  return String(data);
};

// 转为对象
export const toObject = (data: any) => {
  if (Buffer.isBuffer(data)) return JSON.parse(data.toString());
  if (typeof data === 'object') return data;
  if (typeof data === 'string') return JSON.parse(data);
  // return String(data);
};

export const has = (o: any, k: any) => Object.prototype.hasOwnProperty.call(o, k);

// 获取number类型的10位时间戳
export const getTimeStampNumber = () => Number(new Date().getTime().toString().substr(0, 10));

// 添加 User-Agent
export const addUserAgent = (header: RawAxiosRequestHeaders | AxiosHeaders) => {
  const sdkVersion = version;
  header['User-Agent'] = `BotNodeSDK/v${sdkVersion}`;
};
// 添加 User-Agent
export const addAuthorization = (header: RawAxiosRequestHeaders | AxiosHeaders, appID: string, token: string) => {
  header['Authorization'] = `Bot ${appID}.${token}`;
};
// 组装完整Url
export const buildUrl = (path = '', isSandbox?: boolean) => {
  return `${isSandbox ? 'https://sandbox.api.sgroup.qq.com' : 'https://api.sgroup.qq.com'}${path}`;
};
