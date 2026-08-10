import { RestyResponse } from 'resty-client';

/**
 * ============= 入群自动审批策略接口 =============
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy.get.html
 */
export interface JoinApprovalStrategyAPI {
    strategies: (pager?: JoinApprovalStrategyListPager) => Promise<RestyResponse<IJoinApprovalStrategyListResponse>>;
    createStrategy: (payload: JoinApprovalStrategyToCreate) => Promise<RestyResponse<JoinApprovalStrategyCreateResponse>>;
    updateStrategy: (strategyID: string, payload: JoinApprovalStrategyToUpdate) => Promise<RestyResponse<JoinApprovalStrategyUpdateResponse>>;
    deleteStrategy: (strategyID: string) => Promise<RestyResponse<any>>;
    executeStrategy: (strategyID: string) => Promise<RestyResponse<any>>;
    updateStrategyWhitelist: (strategyID: string, payload: JoinApprovalStrategyWhitelistUsersToUpdate) => Promise<RestyResponse<JoinApprovalStrategyWhitelistUsersResponse>>;
}

/**
 * 查询入群自动审批策略列表
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy.get.html
 */
export interface JoinApprovalStrategyListPager {
    cursor?: string; // 分页游标，首次请求可不传或传空串
    limit?: number; // 单页数量，默认 20，最大 100
}

export interface IJoinApprovalStrategyListResponse {
    strategies: IJoinApprovalStrategy[]; // 生效中的策略列表
    next_cursor: string; // 下一页游标，空串表示已到末页
}

export interface IJoinApprovalStrategy {
    strategy_id: string; // 策略 ID
    group_openids: string[]; // 关联的群 openid 列表（创建时使用 group_openids 时返回）
    group_ids: string[]; // 关联的 QQ 群号列表（uint64，使用字符串避免精度问题；创建时使用 group_ids 时返回）
    whitelist_user_count: number; // 白名单中的号码数量（估算，可能存在少量误差）
    is_enable: 'on' | 'off'; // 策略是否启用: on=启用, off=关闭
    expire_at: string; // 过期时间（RFC3339 格式）
    created_at: string; // 创建时间（RFC3339 格式）
    updated_at: string; // 最近更新时间（RFC3339 格式）
    remark?: string; // 策略备注
}

/**
 * 创建入群自动审批策略
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy.post.html
 */
export interface JoinApprovalStrategyToCreate {
    group_openids?: string[]; // 关联的群 openid 列表，最多 100 个；与 group_ids 互斥，二者必填其一
    group_ids?: number[]; // 关联的 QQ 群号列表（uint64），最多 100 个；与 group_openids 互斥，二者必填其一
    is_enable?: 'on' | 'off'; // 是否启用策略，默认 on
    expire_at?: string; // 过期时间（RFC3339 格式）；不传默认一年过期
    remark?: string; // 策略备注，最多 255 个汉字
}

export interface JoinApprovalStrategyCreateResponse {
    strategy_id: string; // 服务端生成的策略 ID
    is_enable: 'on' | 'off'; // 是否启用
    expire_at: string; // 过期时间（RFC3339 格式）
}

/**
 * 修改入群自动审批策略
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy_strategy_id.patch.html
 */
export interface JoinApprovalStrategyToUpdate {
    is_enable?: 'on' | 'off'; // 是否启用策略
    expire_at?: string; // 过期时间（RFC3339 格式）
    group_action?: JoinApprovalStrategyGroupAction; // 关联群增删操作；群标识形式须与创建时一致
    remark?: string; // 策略备注，最多 255 个汉字
}

export interface JoinApprovalStrategyGroupAction {
    op: 'add' | 'del'; // 操作类型: add=新增关联群, del=删除关联群
    group_openids?: string[]; // 待操作的群 openid 列表；与 group_ids 互斥
    group_ids?: number[]; // 待操作的 QQ 群号列表（uint64）；与 group_openids 互斥
}

export interface JoinApprovalStrategyUpdateResponse {
    is_enable: 'on' | 'off'; // 是否启用
    expire_at: string; // 过期时间（RFC3339 格式）
}

/**
 * 修改入群自动审批策略白名单号码
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_join_approval_strategy_strategy_id_whitelist_users.post.html
 */
export interface JoinApprovalStrategyWhitelistUsersToUpdate {
    op: 'add' | 'del'; // 操作类型: add=新增号码, del=删除号码
    whitelist_users: string[]; // QQ 号码列表，单次最多 10000 个；使用字符串类型避免 JS 精度问题
}

export interface JoinApprovalStrategyWhitelistUsersResponse {
    strategy_id: string; // 策略 ID
    whitelist_user_count: number; // 操作后策略当前白名单号码数（估算）
    updated_at: string; // 策略更新时间（RFC3339 格式）
}
