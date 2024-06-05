import { RestyResponse } from 'resty-client';
import { Ark, MessageKeyboard, MessageMarkdown } from './message';

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
    content?: string;
    msg_type: number; // 0. 文本 1. 图文混排 2. markdown 3. ark 4. embed 7. media 富媒体
    msg_id?: string;
    msg_seq?: number;
    media?: GMedia;
    ark?: Ark;
    keyboard?: MessageKeyboard;
    markdown?: MessageMarkdown;
    event_id?: string;
}

export interface GMedia {
    file_info: string;
}

export interface GFileToCreate {
    file_type: number; // 参数: 1.图片 2.视频 3.语音 4.文件（暂不开放）// 文件格式: 图片png/jpg 视频mp4 语音silk
    url: string;
    srv_send_msg: boolean; // 当为 true 消息会直接发送到目标端，占用 主动消息频次，超频会发送失败。为 false 时消息不会直接发送到目标端，返回的 file_info 字段数据，可使用在消息发送接口 media 字段中
}

export interface GMessageRec {
    group_code: string;
    msg?: string;
    msg_seq?: string;
    ret?: number;
}

export interface GFileRec {
    file_uuid: string;
    file_info: string;
    ttl: string;
}