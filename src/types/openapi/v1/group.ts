import { RestyResponse } from 'resty-client';
import { Ark, MessageKeyboard, MessageMarkdown } from './message';

/**
 * =============  Group 消息接口  =============
 */
export interface GroupAPI {
    // message: (channelID: string, messageID: string) => Promise<RestyResponse<IMessageRes>>;
    // messages: (channelID: string, pager: MessagesPager) => Promise<RestyResponse<IMessage[]>>;
    postMessage: (openID: string, message: GMessageToCreate) => Promise<RestyResponse<GCMessageResponse>>;
    postFile: (openID: string, message: FileToCreate) => Promise<RestyResponse<MediaUploadResponse>>;
    deleteMessage: (openID: string, messageID: string) => Promise<RestyResponse<any>>;
    info: (openID: string) => Promise<RestyResponse<IGroupInfo>>;
    botState: (openID: string) => Promise<RestyResponse<IBotState>>;
    joinRequestList: (openID: string, pager?: JoinRequestListPager) => Promise<RestyResponse<IJoinRequestListResponse>>;
    approvalJoinRequest: (openID: string, memberOpenID: string, payload: ApprovalJoinRequestPayload) => Promise<RestyResponse<any>>;
    restrictChatSetting: (openID: string) => Promise<RestyResponse<IRestrictChatSetting>>;
    setRestrictChatSetting: (openID: string, payload: SetRestrictChatSettingPayload) => Promise<RestyResponse<any>>;
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
    subscribe_id?: string; // 订阅 id
}

export interface GMedia {
    file_info: string;
}

export interface FileToCreate {
    file_type: number; // 参数: 1.图片 2.视频 3.语音 4.文件（暂不开放）// 文件格式: 图片png/jpg 视频mp4 语音silk
    file_data?: string; // base64 编码后的文件
    url?: string;
    srv_send_msg: boolean; // 当为 true 消息会直接发送到目标端，占用 主动消息频次，超频会发送失败。为 false 时消息不会直接发送到目标端，返回的 file_info 字段数据，可使用在消息发送接口 media 字段中
}

export interface MediaUploadResponse {
    file_uuid: string;
    file_info: string;
    ttl: string;
}

/**
 * group/c2c通用消息发送接口
 */
export interface GCMessageResponse {
    id: string;
    timestamp: number | string;
    /** 消息的引用索引信息（出站时由 QQ 服务端返回） */
    ext_info?: {
        ref_idx?: string;
    };
}

export interface CUser {
    id: string;
    username: string;
    bot: boolean;
    member_openid: string;
    scope: string; //'single';
    is_you: boolean;
    member_role: 'member' | 'admin' | 'owner'; //'member';
}

/**
 * 获取群基础信息
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_info.get.html
 */
export interface IGroupInfo {
    group_openid: string; // 群 OpenID
    group_name: string; // 群名称
    group_finger_memo: string; // 群简介
    group_class_text: string; // 群分类
    group_tags: string[]; // 群标签列表
    group_member_num: number; // 群成员人数
}

/**
 * 获取机器人群内状态
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_bot_state.get.html
 */
export interface IBotState {
    member_openid: string; // 机器人的 OpenID
    joined_at: string; // 入群时间，RFC3339 格式
    allow_proactive_msg: boolean; // 是否接收主动推送
    recv_msg_setting: 'all' | 'only_mention' | 'mention_and_context'; // 接收消息类型: all=全部, only_mention=仅@, mention_and_context=@和上下文
    member_role: 'member' | 'admin' | 'owner'; // 群成员角色: member=普通成员, owner=群主, admin=管理员
}

/**
 * 入群申请列表拉取
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_join_request_list.get.html
 */
export interface JoinRequestListPager {
    cursor?: string; // 分页游标，首次请求可不传或传空串
    limit?: number; // 单页数量，默认 20，最大 100
}

export interface IJoinRequestListResponse {
    list: IJoinRequest[]; // 入群申请列表
    next_cursor: string; // 下一页游标，空串表示已到末页
}

export interface IJoinRequest {
    join_request_id: string; // 申请ID，需要在申请接口回传
    risk_tips: string; // 安全提示语；可疑消息直接返回 warning_tips；普通消息命中 sec_risk_rules 时返回 top_tips
    union_openid: string; // 用户在应用/开放平台下的统一标识（如有）
    member_openid: string; // 申请人 openid
    username: string; // 申请人昵称
    apply_at: string; // 申请时间戳（RFC3339 格式）
    apply_source: 'self_apply' | 'invited'; // 申请来源: self_apply=主动申请, invited=被邀请
    invited_by: string; // 邀请人 openid（apply_source=invited 时有效）
    bot: boolean; // 是否为机器人账号
    verify_info: IVerifyInfo; // 用户入群验证方式
}

export interface IVerifyInfo {
    method: 'verify_message' | 'admin_review_qa'; // 入群验证方式
    verify_message?: string; // 验证消息内容；仅 method=verify_message 时可能携带
    review_qa_list?: IReviewQA[]; // 问答列表；仅 method=admin_review_qa 时可能携带
}

export interface IReviewQA {
    question: string; // 管理员设置的问题
    answer: string; // 申请人填写的答案
}

/**
 * 入群申请审批请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_approval_join_request_member_openid.post.html
 */
export interface ApprovalJoinRequestPayload {
    op: 'approve' | 'decline'; // 审批动作: approve=通过, decline=拒绝
    join_request_id?: string; // 申请ID
    reject_reason?: string; // 拒绝理由，op=decline 时可填
    add_to_member_blacklist?: boolean; // 是否同时加入群黑名单，默认 false，op=decline 时可填
}

/**
 * 查询群禁言状态响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_restrict_chat_setting.get.html
 */
export interface IRestrictChatSetting {
    global_rule: IGlobalMuteRule; // 群级禁言规则（全员禁言配置）
    members: IMemberMuteState[]; // 当前处于禁言中的用户列表（不含已过期）
}

export interface IGlobalMuteRule {
    mode: 'none' | 'always' | 'schedule'; // 全员禁言模式: none=未开启, always=始终禁言, schedule=定时禁言（定时和周期性）
    schedule_rules: IMuteScheduleRule[]; // 定时禁言规则列表（可包含多条）
    recurring_rules: IMuteRecurringRule[]; // 周期禁言规则列表（可包含多条）
}

export interface IMuteScheduleRule {
    task_id: string; // 任务ID，用于标记此定时禁言任务
    start_at: string; // 禁言开始时间（RFC3339 格式）
    end_at: string; // 禁言结束时间（RFC3339 格式）
    enabled: boolean; // 此规则是否启用
}

export interface IMuteRecurringRule {
    task_id: string; // 任务ID，用于标记此周期禁言规则
    weekdays: number[]; // 生效星期几列表，取值 1~7（1=周一，7=周日），可多选
    start_time: string; // 时段开始时间，格式 HH:mm（北京时间）
    end_time: string; // 时段结束时间，格式 HH:mm（北京时间）；若小于 start_time 表示跨天到次日
    enabled: boolean; // 此规则是否启用
}

export interface IMemberMuteState {
    member_openid: string; // 被禁言成员的 openid
    mute_expire_at: string; // 禁言到期时间（RFC3339 格式）
    username: string; // 被禁言成员的昵称
    union_openid: string; // 用户在应用/开放平台下的统一标识（如有）
}

/**
 * 设置群成员禁言请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_restrict_chat_setting.post.html
 */
export interface SetRestrictChatSettingPayload {
    members?: ISetMemberMuteState[]; // 用户禁言列表；每项通过 op 控制增/改/删，单次设置不能超过10个
}

export interface ISetMemberMuteState {
    op: 'add' | 'update' | 'del'; // 操作类型: add=增加禁言, update=更新禁言到期时间, del=解除禁言
    member_openid: string; // 被禁言成员的 openid；增加/更新时，只能操作普通成员，不能操作群主、管理员、机器人
    mute_expire_at?: string; // 禁言到期时间（RFC3339 格式）；op=del 时可传空串表示立即解除禁言
}
