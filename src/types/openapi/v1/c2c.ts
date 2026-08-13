import type { RestyResponse } from 'resty-client';
import type { FileToCreate, GCMessageResponse, GMessageToCreate, MediaUploadResponse } from './group';
import type { MessageKeyboard } from './message';

/**
 * =============  C2C 消息接口  =============
 */
export interface C2CAPI {
    postStreamingMessage: (openID: string, message: StreamMessageRequest) => Promise<RestyResponse<GCMessageResponse>>;
    postMessage: (openID: string, message: CMessageToCreate) => Promise<RestyResponse<GCMessageResponse>>;
    postFile: (openID: string, message: FileToCreate, useChunkedUpload?: boolean) => Promise<RestyResponse<MediaUploadResponse>>;
    deleteMessage: (openID: string, messageID: string) => Promise<RestyResponse<any>>;
}

export interface CMessageToCreate extends GMessageToCreate {
    is_wakeup?: boolean; // 指明发送消息为互动召回消息，与 msg_id，event_id 互斥使用
    input_notify?: IInputNotify; // 输入中状态，msg_type=6时使用
    prompt_keyboard?: {
        keyboard: MessageKeyboard; // 附在消息下面的小按钮，最多 3 个
    };
}

export interface IInputNotify {
    input_type?: number; // 填 1
    input_second?: number; // 状态持续时间，最长60s
}

// ---- 流式消息常量 ----

/** 流式消息输入模式 */
export const StreamInputMode = {
    /** 每次发送的 content_raw 替换整条消息内容 */
    REPLACE: 'replace',
} as const;
export type StreamInputMode = (typeof StreamInputMode)[keyof typeof StreamInputMode];

/** 流式消息输入状态 */
export const StreamInputState = {
    /** 正文生成中 */
    GENERATING: 1,
    /** 正文生成结束（终结状态） */
    DONE: 10,
} as const;
export type StreamInputState = (typeof StreamInputState)[keyof typeof StreamInputState];

/** 流式消息内容类型 */
export const StreamContentType = {
    MARKDOWN: 'markdown',
} as const;
export type StreamContentType = (typeof StreamContentType)[keyof typeof StreamContentType];

/**
 * 流式消息请求体
 * 对应 StreamReq proto
 */
export interface StreamMessageRequest {
    /** 输入模式 */
    input_mode: StreamInputMode;
    /** 输入状态 */
    input_state: StreamInputState;
    /** 内容类型 */
    content_type: StreamContentType;
    /** markdown 内容 */
    content_raw: string;
    /** 事件 ID */
    event_id: string;
    /** 原始消息 ID */
    msg_id: string;
    /** 流式消息 ID，首次发送后返回，后续分片需携带 */
    stream_msg_id?: string;
    /** 递增序号 */
    msg_seq: number;
    /** 同一条流式会话内的发送索引，从 0 开始，每次发送前递增；新流式会话重新从 0 开始 */
    index: number;
}
