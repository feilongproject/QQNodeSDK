import fetch from "node-fetch";
import { GetWsParam } from "../types";


export function delayTime(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function buildFetch(config: GetWsParam, path = '', isSandbox?: boolean) {
    return fetch(`${isSandbox ? 'https://sandbox.api.sgroup.qq.com' : 'https://api.sgroup.qq.com'}${path}`, {
        headers: {
            'User-Agent': `QQGuildNodeSDK/feilongproject`,
            'Authorization': `Bot ${config.appID}.${config.token}`,
        }
    });
}

export function toObject(data: any) {
    if (Buffer.isBuffer(data)) return JSON.parse(data.toString());
    if (typeof data === 'object') return data;
    if (typeof data === 'string') return JSON.parse(data);
    // return String(data);
};
