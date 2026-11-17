import type { RestyResponse } from 'resty-client';

/**
 * =============  MediaImages 素材管理接口  =============
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html
 */
export interface MediaImagesAPI {
    // 申请图片上传
    prepare: (payload: MediaImagePreparePayload) => Promise<RestyResponse<IMediaImagePrepareResponse>>;
    // 完成图片上传
    complete: (payload: MediaImageCompletePayload) => Promise<RestyResponse<IMediaImageCompleteResponse>>;
    // 查询有效图片列表
    list: (pager?: MediaImageListPager) => Promise<RestyResponse<IMediaImageListResponse>>;
    // 删除图片
    delete: (imageID: string) => Promise<RestyResponse<any>>;
}

/**
 * 支持的图片 MIME 类型
 */
export type MediaImageContentType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';

/**
 * 申请图片上传请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#申请图片上传
 */
export interface MediaImagePreparePayload {
    file_name: string; // 文件名（含扩展名，如 kline.png）
    file_size: number; // 文件大小（字节）
    content_type: MediaImageContentType; // 图片 MIME 类型
    md5: string; // 文件内容 MD5（32 位十六进制）
    sha1: string; // 文件内容 SHA1（40 位十六进制）
}

/**
 * 申请图片上传响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#申请图片上传
 */
export interface IMediaImagePrepareResponse {
    upload_id: string; // 上传任务 ID，4 小时内有效
    presigned_url: string; // 预签名上传 URL，用 HTTP PUT 直传图片二进制
    expires_in: number; // 预签名 URL 有效期（秒），过期后需重新申请
}

/**
 * 完成图片上传请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#完成图片上传
 */
export interface MediaImageCompletePayload {
    upload_id: string; // prepare 返回的上传任务 ID
    md5: string; // 上传返回的 ETag（文件 MD5，32 位十六进制）
}

/**
 * 完成图片上传响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#完成图片上传
 */
export interface IMediaImageCompleteResponse {
    image_id: string; // 图片 ID，用于查询与删除
    url: string; // Markdown 引用链接：qqbot-media://image/v1/<token>
    ttl: number; // 滑动有效期窗口（秒），90 天内未被引用则失效
    preview_url: string; // 临时预览链接（短时效），仅供预览与发送前自查，请勿持久化存储
}

/**
 * 查询有效图片列表分页参数
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#查询有效图片
 */
export interface MediaImageListPager {
    cursor?: string; // 分页游标，首页不传，翻页使用上一页返回的 next_cursor
}

/**
 * 素材图片信息
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#查询有效图片
 */
export interface IMediaImage {
    image_id: string; // 图片 ID
    url: string; // Markdown 引用链接
    file_name: string; // 上传时的文件名
    preview_url: string; // 临时预览链接（短时效），请勿持久化存储
    created_at: number; // 上传时间（Unix 秒）
    expires_at: number; // 过期时间（Unix 秒），每次被引用后自动顺延
}

/**
 * 查询有效图片列表响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/message/material-management.html#查询有效图片
 */
export interface IMediaImageListResponse {
    images: IMediaImage[]; // 图片列表
    next_cursor: string; // 下一页游标，为空表示末页
    total: number; // 当前有效图片总数（与数量上限同一口径）
}
