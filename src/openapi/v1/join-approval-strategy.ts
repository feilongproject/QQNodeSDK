import {
    Config,
    OpenAPIRequest,
    JoinApprovalStrategyAPI,
    IJoinApprovalStrategyListResponse,
    JoinApprovalStrategyToCreate,
    JoinApprovalStrategyCreateResponse,
    JoinApprovalStrategyToUpdate,
    JoinApprovalStrategyUpdateResponse,
    JoinApprovalStrategyWhitelistUsersToUpdate,
    JoinApprovalStrategyWhitelistUsersResponse,
    JoinApprovalStrategyListPager,
} from '@src/types';
import { RestyResponse } from 'resty-client';
import { getURL } from './resource';

export default class JoinApprovalStrategy implements JoinApprovalStrategyAPI {
    public request: OpenAPIRequest;
    public config: Config;
    constructor(request: OpenAPIRequest, config: Config) {
        this.request = request;
        this.config = config;
    }

    /**
     * 查询入群自动审批策略列表
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy.get.html
     */
    public strategies(pager?: JoinApprovalStrategyListPager): Promise<RestyResponse<IJoinApprovalStrategyListResponse>> {
        const options = {
            method: 'GET' as const,
            url: getURL('joinApprovalStrategyURI'),
            params: pager,
        };
        return this.request<IJoinApprovalStrategyListResponse>(options);
    }

    /**
     * 创建入群自动审批策略
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy.post.html
     */
    public createStrategy(payload: JoinApprovalStrategyToCreate): Promise<RestyResponse<JoinApprovalStrategyCreateResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('joinApprovalStrategyURI'),
            data: payload,
        };
        return this.request<JoinApprovalStrategyCreateResponse>(options);
    }

    /**
     * 修改入群自动审批策略
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy_strategy_id.patch.html
     */
    public updateStrategy(strategyID: string, payload: JoinApprovalStrategyToUpdate): Promise<RestyResponse<JoinApprovalStrategyUpdateResponse>> {
        const options = {
            method: 'PATCH' as const,
            url: getURL('joinApprovalStrategyIDURI'),
            rest: {
                strategyID,
            },
            data: payload,
        };
        return this.request<JoinApprovalStrategyUpdateResponse>(options);
    }

    /**
     * 删除入群自动审批策略
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy_strategy_id.delete.html
     */
    public deleteStrategy(strategyID: string): Promise<RestyResponse<any>> {
        const options = {
            method: 'DELETE' as const,
            url: getURL('joinApprovalStrategyIDURI'),
            rest: {
                strategyID,
            },
        };
        return this.request(options);
    }

    /**
     * 执行入群自动审批策略
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy_strategy_id_execute.post.html
     */
    public executeStrategy(strategyID: string): Promise<RestyResponse<any>> {
        const options = {
            method: 'POST' as const,
            url: getURL('joinApprovalStrategyExecuteURI'),
            rest: {
                strategyID,
            },
        };
        return this.request(options);
    }

    /**
     * 修改入群自动审批策略的白名单号码
     * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy_strategy_id_whitelist_users.post.html
     */
    public updateStrategyWhitelist(strategyID: string, payload: JoinApprovalStrategyWhitelistUsersToUpdate): Promise<RestyResponse<JoinApprovalStrategyWhitelistUsersResponse>> {
        const options = {
            method: 'POST' as const,
            url: getURL('joinApprovalStrategyWhitelistURI'),
            rest: {
                strategyID,
            },
            data: payload,
        };
        return this.request<JoinApprovalStrategyWhitelistUsersResponse>(options);
    }
}
