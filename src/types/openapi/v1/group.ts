import { RestyResponse } from 'resty-client';

/**
 * =============  Group 消息接口  =============
 */
export interface GroupAPI {
    // message: (channelID: string, messageID: string) => Promise<RestyResponse<IMessageRes>>;
    // messages: (channelID: string, pager: MessagesPager) => Promise<RestyResponse<IMessage[]>>;
    postMessage: (openID: string, message: GMessageToCreate) => Promise<RestyResponse<GMessageRec>>;
    postFile: (openID: string, message: GFileToCreate) => Promise<RestyResponse<GFileRec>>;
    // deleteMessage: (channelID: string, messageID: string, hideTip?: boolean) => Promise<RestyResponse<any>>;
}

export interface GMessageToCreate {
    content: string;
    msg_type: number; // 0 是文本，1 图文混排 ，2 是 markdown 3 ark，4 embed
    msg_id?: string;
}

export interface GFileToCreate {
    file_type: number; // 1 图片，2 视频，3 语音，4 文件（暂不开放）// 图片：png/jpg，视频：mp4，语音：silk
    url: string;
    srv_send_msg: boolean;
}

export interface GMessageRec {
    group_code: string;
    msg?: string;
    msg_seq?: string;
    ret?: number;
}

export interface GFileRec {
    file_uuid: string;
}