import type { RestyResponse } from 'resty-client';

/**
 * =============  GroupMember 群成员接口  =============
 */
export interface GroupMemberAPI {
    // 获取群成员列表
    members: (openID: string, pager?: GroupMemberListPager) => Promise<RestyResponse<IGroupMemberListResponse>>;
    // 获取群成员详细信息
    member: (openID: string, memberOpenID: string) => Promise<RestyResponse<IGroupMember>>;
    // 批量移除群成员
    batchRemoveMembers: (openID: string, payload: BatchRemoveMembersPayload) => Promise<RestyResponse<IBatchRemoveMembersResponse>>;
    // 查询群黑名单列表
    memberBlacklist: (openID: string, pager?: GroupBlacklistPager) => Promise<RestyResponse<IGroupBlacklistResponse>>;
    // 操作群黑名单（add 加入黑名单 / del 移出黑名单）
    setMemberBlacklist: (openID: string, payload: MemberBlacklistOpPayload) => Promise<RestyResponse<IMemberBlacklistOpResponse>>;
}

/**
 * 获取群成员列表分页参数
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_members.get.html
 */
export interface GroupMemberListPager {
    cursor?: string; // 分页游标，首次请求可不传或传空串；后续传上一次响应的 next_cursor
}

/**
 * 群成员信息
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_members_member_openid.get.html
 */
export interface IGroupMember {
    member_openid: string; // 成员 OpenID
    username: string; // 用户昵称
    member_role: 'member' | 'admin' | 'owner'; // 群成员角色: member=普通成员, owner=群主, admin=管理员
    bot: boolean; // 是否机器人
    joined_at: string; // 入群时间戳（RFC3339 格式）
    union_openid?: string; // 用户在应用/开放平台下的统一标识（如有）
}

/**
 * 获取群成员列表响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_members.get.html
 */
export interface IGroupMemberListResponse {
    members: IGroupMember[]; // 成员列表，每次最多返回 30 条
    next_cursor: string; // 下一页游标，空串表示已到末页
}

/**
 * 批量移除群成员请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_batch_remove_members.post.html
 */
export interface BatchRemoveMembersPayload {
    member_openids: string[]; // 需要移除的成员 member_openid 列表，单次最多 20 个
    add_to_member_blacklist?: boolean; // 是否同时加入群黑名单，默认 false
}

/**
 * 批量移除群成员响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_batch_remove_members.post.html
 */
export interface IBatchRemoveMembersResponse {
    remove_members_result: string; // 成功时返回 success
    add_to_member_blacklist_fail_openids: string[]; // 拉黑失败的 openid
}

/**
 * 群黑名单列表分页参数
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_member_blacklist.get.html
 */
export interface GroupBlacklistPager {
    cursor?: string; // 分页游标，首次请求可不传或传空串
    limit?: number; // 单页数量，默认 20，最大 100
}

/**
 * 群黑名单用户
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_member_blacklist.get.html
 */
export interface IBlacklistUser {
    union_openid?: string; // 用户在应用/开放平台下的统一标识（如有）
    member_openid: string; // 用户 openid
    username: string; // 用户昵称
    banned_at: string; // 拉黑时间戳（RFC3339 格式）
    bot: boolean; // 是否为机器人账号
}

/**
 * 查询群黑名单列表响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_member_blacklist.get.html
 */
export interface IGroupBlacklistResponse {
    users: IBlacklistUser[]; // 黑名单用户列表
    next_cursor: string; // 下一页游标，空串表示已到末页
}

/**
 * 群黑名单操作请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_member_blacklist.post.html
 */
export interface MemberBlacklistOpPayload {
    op: 'del' | 'add'; // 操作类型: del=移出黑名单, add=加入黑名单（目标成员在群中时无法加入黑名单）
    member_openids: string[]; // 目标成员 openid 列表，单次最多 20 个
}

/**
 * 群黑名单操作响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_member_blacklist.post.html
 */
export interface IMemberBlacklistOpResponse {
    fail_openids: string[]; // 操作失败的 openid 列表（op=add 时返回拉黑失败列表；op=del 时同义）
}
