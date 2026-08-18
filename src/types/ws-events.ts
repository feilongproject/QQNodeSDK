/**
 * WebSocket 事件返回类型映射
 *
 * 网关事件经过 dispatchEvent 分发后，ws.on(intents, cb) 回调收到的
 * data 为 WsEventData<载荷>：{ eventType, eventId, msg }。
 * 本文件为每个 AvailableIntentsEventsEnum 提供对应的载荷类型，
 * 事件字段以官方文档为准：https://bot.q.qq.com/wiki/develop/api-v2/autogen/
 */

import { AvailableIntentsEventsEnum, WsEventData } from './websocket-types';
import { IChannel } from './openapi/v1/channel';
import { IGuild, IMember } from './openapi/v1/guild';
import { IMessage } from './openapi/v1/message';
import { IDirectMessage } from './openapi/v1/direct-message';
import { IVerifyInfo } from './openapi/v1/group';

export interface WsReady {
    version: number;
    session_id: string;
    user: {
        id: string;
        username: string;
        bot: boolean;
        status: number;
    };
    shard: number[];
}

// ============ 频道 / 子频道 ============
// GUILD_CREATE / GUILD_UPDATE / GUILD_DELETE -> IGuild
// CHANNEL_CREATE / CHANNEL_UPDATE / CHANNEL_DELETE -> IChannel

// ============ 频道成员 ============
/** GUILD_MEMBER_ADD / GUILD_MEMBER_UPDATE */
export interface WsGuildMemberUpdate extends IMember {
    pending?: boolean;
    op_user_id?: string;
}

/** GUILD_MEMBER_REMOVE */
export interface WsGuildMemberRemove {
    guild_id: string;
    user: IMember['user'];
    op_user_id: string;
}

// ============ 消息删除 ============
/** MESSAGE_DELETE / PUBLIC_MESSAGE_DELETE / DIRECT_MESSAGE_DELETE */
export interface WsMessageDelete {
    id: string;
    channel_id: string;
    guild_id: string;
}

// ============ 表情表态 ============
/** MESSAGE_REACTION_ADD / MESSAGE_REACTION_REMOVE */
export interface WsMessageReaction {
    user_id: string;
    guild_id: string;
    channel_id: string;
    target: {
        id: string;
        type: number; // 0 消息 1 帖子 2 评论 3 回复
    };
    emoji: {
        id: string;
        type: number;
    };
}

// ============ 消息审核 ============
/** MESSAGE_AUDIT_PASS / MESSAGE_AUDIT_REJECT */
export interface WsMessageAudited {
    audit_id: string;
    message_id: string;
    guild_id: string;
    channel_id: string;
    audit_time: string;
    create_time: string;
}

// ============ 互动 ============
/** INTERACTION_CREATE */
export interface WsInteractionCreate {
    id: string;
    type: number; // 11 按钮回调 12 快捷菜单 13 消息反馈 14 清空会话 15 进出故事集 16 切换模型 18/19 授权
    scene?: 'c2c' | 'group' | 'guild';
    chat_type?: number;
    timestamp?: string;
    guild_id?: string;
    channel_id?: string;
    user_openid?: string;
    group_openid?: string;
    group_member_openid?: string;
    data: {
        type: number;
        resolved?: {
            button_data?: string;
            button_id?: string;
            user_id?: string;
            feature_id?: string;
            message_id?: string;
            feedback_opt?: string;
            checked?: number;
            action?: string;
            message_scene?: { ext?: string[] };
            authorize_data?: { opt_scene?: string; scope?: string };
        };
    };
    version: number;
    application_id: string;
}

// ============ 论坛 ============
/** FORUM_THREAD_CREATE / FORUM_THREAD_UPDATE / FORUM_THREAD_DELETE */
export interface WsForumThread {
    guild_id: string;
    channel_id: string;
    author_id: string;
    thread_info: {
        thread_id: string;
        title: string;
        content: string;
        date_time: string;
    };
}

/** FORUM_POST_CREATE / FORUM_POST_DELETE */
export interface WsForumPost {
    guild_id: string;
    channel_id: string;
    author_id: string;
    post_info: {
        thread_id: string;
        post_id: string;
        content: string;
        date_time: string;
    };
}

/** FORUM_REPLY_CREATE / FORUM_REPLY_DELETE */
export interface WsForumReply {
    guild_id: string;
    channel_id: string;
    author_id: string;
    reply_info: {
        thread_id: string;
        post_id: string;
        reply_id: string;
        content: string;
        date_time: string;
    };
}

/** FORUM_PUBLISH_AUDIT_RESULT */
export interface WsForumAuditResult {
    guild_id: string;
    channel_id: string;
    author_id: string;
    thread_id: string;
    post_id: string;
    reply_id: string;
    type: number; // 1 主帖 2 评论 3 回复
    result: number; // 0 成功 1 失败
    err_msg?: string;
}

// ============ 音频 ============
/** AUDIO_START / AUDIO_FINISH / AUDIO_ON_MIC / AUDIO_OFF_MIC */
export interface WsAudioAction {
    guild_id: string;
    channel_id: string;
    audio_url: string;
    text: string;
    status: number; // 0 START 1 PAUSE 2 RESUME 3 STOP
}

// ============ 群 / 私聊 ============
/** 事件中的 User（v2 OpenID 场景） */
export interface WsUser {
    id: string;
    username: string;
    bot: boolean;
    union_openid?: string;
    union_user_account?: string;
    user_openid?: string;
    member_openid?: string;
    member_role?: 'member' | 'admin' | 'owner';
}

export interface WsMessageScene {
    source: string;
    ext: string[]; // key=value 列表，如 msg_idx / ref_msg_idx / auth_token
}

export interface WsMessageAttachment {
    url: string;
    filename: string;
    width?: number;
    height?: number;
    size: number;
    content_type: string;
    voice_wav_url?: string;
    asr_refer_text?: string;
}

export interface WsArkData {
    prompt?: string;
    ark_type?: string;
    ark_name?: string;
    fields?: Record<string, unknown>;
}

export interface WsMsgElement {
    msg_idx?: string;
    author?: WsUser;
    message_type?: number;
    content?: string;
    attachments?: WsMessageAttachment[];
    ark_data?: WsArkData;
    msg_elements?: WsMsgElement[];
}

/** C2C_MESSAGE_CREATE */
export interface WsC2CMessage {
    id: string;
    author: WsUser;
    content: string;
    timestamp: string;
    message_type: number; // 0 文本 3 卡片 101 并行 102 聊天记录 103 引用
    message_scene: WsMessageScene;
    attachments?: WsMessageAttachment[];
    ark_data?: WsArkData;
    msg_elements?: WsMsgElement[];
}

/** GROUP_MESSAGE_CREATE / GROUP_AT_MESSAGE_CREATE */
export interface WsGroupMessage extends WsC2CMessage {
    group_openid: string;
    mentions?: WsUser[];
}

/** FRIEND_ADD / FRIEND_DEL */
export interface WsFriendEvent {
    timestamp: number;
    openid: string;
    scene?: number;
    scene_param?: string;
    author?: { union_openid: string };
    short_code?: string;
}

/** GROUP_ADD_ROBOT / GROUP_DEL_ROBOT / GROUP_MSG_RECEIVE / GROUP_MSG_REJECT */
export interface WsGroupEvent {
    timestamp: number;
    group_openid: string;
    op_member_openid: string;
}

/** C2C_MSG_RECEIVE / C2C_MSG_REJECT */
export interface WsC2CMsgSwitchEvent {
    timestamp: number;
    openid: string;
}

/** SUBSCRIBE_MESSAGE_STATUS */
export interface WsSubscribeMsgTemplateResult {
    template_id: number;
    custom_template_id: string;
    op: number; // 1 允许订阅 2 拒绝订阅
    subscribe_id: string;
    subscribe_ts: number;
    update_ts: number;
}

export interface WsSubscribeMessageStatus {
    group_openid?: string;
    openid?: string;
    result: WsSubscribeMsgTemplateResult[];
}

/** GROUP_MEMBER_ADD / GROUP_MEMBER_REMOVE */
export interface WsGroupMemberEvent {
    timestamp: number;
    group_openid: string;
    member_openid: string;
    user_openid?: string;
}

/** GROUP_JOIN_REQUEST（当前 SDK 分发到 GROUP_MEMBER_EVENT） */
export interface WsGroupJoinRequestEvent {
    group_openid: string;
    join_request_id: string;
    risk_tips?: string;
    union_openid?: string;
    member_openid: string;
    username: string;
    apply_at: string;
    apply_source: 'self_apply' | 'invited';
    invited_by?: string;
    bot?: boolean;
    verify_info?: IVerifyInfo;
    auto_approved?: { strategy_id: string };
}

/**
 * 每个 AvailableIntentsEventsEnum 对应的 ws.on 回调数据类型（WsEventData 包裹）
 */
export type WsEventDataMap = {
    [AvailableIntentsEventsEnum.GUILDS]: WsEventData<IGuild | IChannel>;
    [AvailableIntentsEventsEnum.GUILD_MEMBERS]: WsEventData<IMember | WsGuildMemberUpdate | WsGuildMemberRemove>;
    [AvailableIntentsEventsEnum.GUILD_MESSAGES]: WsEventData<IMessage | WsMessageDelete>;
    [AvailableIntentsEventsEnum.GUILD_MESSAGE_REACTIONS]: WsEventData<WsMessageReaction>;
    [AvailableIntentsEventsEnum.DIRECT_MESSAGE]: WsEventData<IDirectMessage | WsMessageDelete>;
    [AvailableIntentsEventsEnum.FORUMS_EVENT]: WsEventData<WsForumThread | WsForumPost | WsForumReply | WsForumAuditResult>;
    [AvailableIntentsEventsEnum.AUDIO_ACTION]: WsEventData<WsAudioAction>;
    [AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES]: WsEventData<IMessage | WsMessageDelete>;
    [AvailableIntentsEventsEnum.MESSAGE_AUDIT]: WsEventData<WsMessageAudited>;
    [AvailableIntentsEventsEnum.INTERACTION]: WsEventData<WsInteractionCreate>;
    [AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT]: WsEventData<
        WsC2CMessage | WsGroupMessage | WsFriendEvent | WsGroupEvent | WsC2CMsgSwitchEvent | WsSubscribeMessageStatus | WsGroupJoinRequestEvent
    >;
    [AvailableIntentsEventsEnum.GROUP_MEMBER_EVENT]: WsEventData<WsGroupMemberEvent | WsGroupJoinRequestEvent>;
    READY: Omit<WsEventData<WsReady>, 'eventId'>;
    ERROR: Omit<WsEventData<string>, 'eventId'>;
};
