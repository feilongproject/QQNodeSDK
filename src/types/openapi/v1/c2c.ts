import { RestyResponse } from 'resty-client';
import { GFileRec, GFileToCreate, GMessageRec, GMessageToCreate } from './group';

/**
 * =============  C2C 消息接口  =============
 */
export interface C2CAPI {
    postMessage: (openID: string, message: GMessageToCreate) => Promise<RestyResponse<GMessageRec>>;
    postFile: (openID: string, message: GFileToCreate) => Promise<RestyResponse<GFileRec>>;
    deleteMessage: (openID: string, messageID: string) => Promise<RestyResponse<any>>;
}
