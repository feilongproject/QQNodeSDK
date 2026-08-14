import {
    Config,
    OpenAPIRequest,
    GroupAPI,
    GMessageToCreate,
    MediaUploadResponse,
    GCMessageResponse,
    FileToCreate,
    IGroupInfo,
    IBotState,
    IJoinRequestListResponse,
    ApprovalJoinRequestPayload,
    IRestrictChatSetting,
    SetRestrictChatSettingPayload,
    JoinRequestListPager,
} from '@src/types';
import { RestyResponse } from 'resty-client';
import { getURL } from './resource';
import { ChunkedUpload } from '@src/utils/chunked-upload';

export default class Group implements GroupAPI {
    public request: OpenAPIRequest;
    public config: Config;
    private chunkedUpload: ChunkedUpload;
    constructor(request: OpenAPIRequest, config: Config) {
        this.request = request;
        this.config = config;
        this.chunkedUpload = new ChunkedUpload(request, config);
    }

    // 发送消息
    public postMessage(openID: string, message: GMessageToCreate): Promise<RestyResponse<GCMessageResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('groupMessagesURI'),
            rest: {
                openID,
            },
            data: message,
        };
        return this.request<GCMessageResponse>(options);
    }

    // 发送文件；useChunkedUpload = true 时启用分片上传
    public postFile(openID: string, message: FileToCreate, useChunkedUpload = false): Promise<RestyResponse<MediaUploadResponse>> {
        if (useChunkedUpload) {
            return this.chunkedUpload.uploadFile(
                openID,
                {
                    prepareURL: getURL('groupUploadPrepareURI'),
                    partFinishURL: getURL('groupUploadPartFinishURI'),
                    mergeURL: getURL('groupFilesURI'),
                },
                message,
            );
        }
        const options = {
            method: 'POST' as const,
            url: getURL('groupFilesURI'),
            rest: {
                openID,
            },
            data: message,
        };
        return this.request<MediaUploadResponse>(options);
    }

    // 撤回消息
    public deleteMessage(openID: string, messageID: string): Promise<RestyResponse<any>> {
        const params = Object.create(null);
        const options = {
            method: 'DELETE' as const,
            url: getURL('groupMessageURI'),
            rest: {
                openID,
                messageID,
            },
            params,
        };
        return this.request(options);
    }

    /**
     * 获取群基础信息
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_info.get.html
     */
    public info(openID: string): Promise<RestyResponse<IGroupInfo>> {
        const options = {
            method: 'GET' as const,
            url: getURL('groupInfoURI'),
            rest: {
                openID,
            },
        };
        return this.request<IGroupInfo>(options);
    }

    /**
     * 获取机器人群内状态
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_bot_state.get.html
     */
    public botState(openID: string): Promise<RestyResponse<IBotState>> {
        const options = {
            method: 'GET' as const,
            url: getURL('groupBotStateURI'),
            rest: {
                openID,
            },
        };
        return this.request<IBotState>(options);
    }

    /**
     * 拉取入群申请列表
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_join_request_list.get.html
     */
    public joinRequestList(openID: string, pager?: JoinRequestListPager): Promise<RestyResponse<IJoinRequestListResponse>> {
        const options = {
            method: 'GET' as const,
            url: getURL('groupJoinRequestListURI'),
            rest: {
                openID,
            },
            params: pager,
        };
        return this.request<IJoinRequestListResponse>(options);
    }

    /**
     * 审批入群申请
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_approval_join_request_member_openid.post.html
     */
    public approvalJoinRequest(openID: string, memberOpenID: string, payload: ApprovalJoinRequestPayload): Promise<RestyResponse<any>> {
        const options = {
            method: 'POST' as const,
            url: getURL('groupApprovalJoinRequestURI'),
            rest: {
                openID,
                memberOpenID,
            },
            data: payload,
        };
        return this.request(options);
    }

    /**
     * 查询群禁言状态
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_restrict_chat_setting.get.html
     */
    public restrictChatSetting(openID: string): Promise<RestyResponse<IRestrictChatSetting>> {
        const options = {
            method: 'GET' as const,
            url: getURL('groupRestrictChatSettingURI'),
            rest: {
                openID,
            },
        };
        return this.request<IRestrictChatSetting>(options);
    }

    /**
     * 设置群成员禁言
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_restrict_chat_setting.post.html
     */
    public setRestrictChatSetting(openID: string, payload: SetRestrictChatSettingPayload): Promise<RestyResponse<any>> {
        const options = {
            method: 'POST' as const,
            url: getURL('groupRestrictChatSettingURI'),
            rest: {
                openID,
            },
            data: payload,
        };
        return this.request(options);
    }
}
