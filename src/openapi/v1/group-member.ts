import {
    Config,
    OpenAPIRequest,
    GroupMemberAPI,
    GroupMemberListPager,
    IGroupMember,
    IGroupMemberListResponse,
    BatchRemoveMembersPayload,
    IBatchRemoveMembersResponse,
    GroupBlacklistPager,
    IGroupBlacklistResponse,
    MemberBlacklistOpPayload,
    IMemberBlacklistOpResponse,
} from '@src/types';
import { RestyResponse } from 'resty-client';
import { getURL } from './resource';

export default class GroupMember implements GroupMemberAPI {
    public request: OpenAPIRequest;
    public config: Config;
    constructor(request: OpenAPIRequest, config: Config) {
        this.request = request;
        this.config = config;
    }

    /**
     * 获取群成员列表
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_members.get.html
     */
    public members(openID: string, pager?: GroupMemberListPager): Promise<RestyResponse<IGroupMemberListResponse>> {
        const options = {
            method: 'GET' as const,
            url: getURL('groupMembersURI'),
            rest: {
                openID,
            },
            params: pager,
        };
        return this.request<IGroupMemberListResponse>(options);
    }

    /**
     * 获取群成员详细信息
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_members_member_openid.get.html
     */
    public member(openID: string, memberOpenID: string): Promise<RestyResponse<IGroupMember>> {
        const options = {
            method: 'GET' as const,
            url: getURL('groupMemberURI'),
            rest: {
                openID,
                memberOpenID,
            },
        };
        return this.request<IGroupMember>(options);
    }

    /**
     * 批量移除群成员
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_batch_remove_members.post.html
     */
    public batchRemoveMembers(openID: string, payload: BatchRemoveMembersPayload): Promise<RestyResponse<IBatchRemoveMembersResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('groupBatchRemoveMembersURI'),
            rest: {
                openID,
            },
            data: payload,
        };
        return this.request<IBatchRemoveMembersResponse>(options);
    }

    /**
     * 查询群黑名单列表
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_member_blacklist.get.html
     */
    public memberBlacklist(openID: string, pager?: GroupBlacklistPager): Promise<RestyResponse<IGroupBlacklistResponse>> {
        const options = {
            method: 'GET' as const,
            url: getURL('groupMemberBlacklistURI'),
            rest: {
                openID,
            },
            params: pager,
        };
        return this.request<IGroupBlacklistResponse>(options);
    }

    /**
     * 操作群黑名单
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_member_blacklist.post.html
     */
    public setMemberBlacklist(openID: string, payload: MemberBlacklistOpPayload): Promise<RestyResponse<IMemberBlacklistOpResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('groupMemberBlacklistURI'),
            rest: {
                openID,
            },
            data: payload,
        };
        return this.request<IMemberBlacklistOpResponse>(options);
    }
}
