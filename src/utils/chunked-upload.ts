import { createHash } from 'crypto';
import axios from 'axios';
import type { Config, OpenAPIRequest, FileToCreate, MediaUploadResponse } from '@src/types';
import type { RestyResponse } from 'resty-client';

/** 计算 buffer 的 MD5 十六进制校验值 */
const md5Hex = (data: Buffer) =>
    createHash('md5')
        .update(data as unknown as NodeJS.ArrayBufferView)
        .digest('hex');
/** 计算 buffer 的 SHA1 十六进制校验值 */
const sha1Hex = (data: Buffer) =>
    createHash('sha1')
        .update(data as unknown as NodeJS.ArrayBufferView)
        .digest('hex');

/** 分片上传流程中需要的三个接口地址 */
export interface ChunkedUploadURLs {
    prepareURL: string; // 预上传接口
    partFinishURL: string; // 分片完成接口
    mergeURL: string; // 完成合并接口（即 files 上传接口）
}

/**
 * 分片上传-预上传请求体（单聊/群聊通用）
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_users_user_id_upload_prepare.post.html
 */
export interface FileUploadPreparePayload {
    file_type?: number; // 业务类型。1=图片, 2=视频, 3=语音, 4=文件
    file_size?: string; // 文件大小（字节）
    file_name?: string; // 文件名
    md5?: string; // 整个文件的 MD5 校验值
    sha1?: string; // 整个文件的 SHA1 校验值
    md5_10m?: string; // 文件前 10002432 字节（约 10MB）的 MD5 校验值，可用于秒传判断，避免重复上传
}

/** 分片信息，每个分片包含一个预签名上传 URL */
export interface UploadPart {
    index: number; // 分片序号，从 0 开始
    presigned_url: string; // 预签名上传 URL，客户端通过 HTTP PUT 将分片数据上传到此 URL
    block_size: string; // 该分块的大小（字节）
}

/** 上传配置，由后台下发控制客户端上传行为 */
export interface UploadConfig {
    concurrency: number; // 上传并发数，默认 1
    retry_timeout: number; // 重试超时时间（秒），默认 300（5分钟）
    retry_delay: number; // 重试延迟（秒），默认 1
}

/**
 * 分片上传-预上传响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_users_user_id_upload_prepare.post.html
 */
export interface UploadPrepareResponse {
    upload_id: string; // 上传任务 ID，后续分片上传和完成合并时需携带
    block_size: string; // 分块大小（字节），默认 5MB。客户端按此大小对文件分片
    parts: UploadPart[]; // 分片列表，每个分片包含一个预签名上传 URL
    upload_config: UploadConfig; // 上传配置，由后台下发控制客户端上传行为
}

/**
 * 分片上传-分片完成请求体（单聊/群聊通用）
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_users_user_id_upload_part_finish.post.html
 */
export interface FileUploadPartFinishPayload {
    upload_id?: string; // 上传任务 ID，来自预上传响应
    part_index?: number; // 分片序号，对应 UploadPart.index
    block_size?: string; // 该分块的实际大小（字节）
    md5?: string; // 该分片的 MD5 校验值
}

/**
 * 富媒体大文件分片上传
 * 1. 调用 upload_prepare 获取 upload_id、block_size 和各分片预签名 URL
 * 2. 按 block_size 将文件分片，逐片 HTTP PUT 到对应的预签名 URL
 * 3. 每片 PUT 成功后调用 upload_part_finish 通知服务端该分片完成
 * 4. 全部分片完成后，携带 upload_id 调用 files 接口完成合并，返回 file_info
 */
export class ChunkedUpload {
    private request: OpenAPIRequest;
    // 保存 config 是为了让 this.request 内部能通过 this.config 读取鉴权信息（request 未绑定，依赖调用方持有 config）
    private config: Config;
    constructor(request: OpenAPIRequest, config: Config) {
        this.request = request;
        this.config = config;
    }

    public async uploadFile(openID: string, urls: ChunkedUploadURLs, message: FileToCreate): Promise<RestyResponse<MediaUploadResponse>> {
        // 获取文件二进制：优先 file_data(base64)，否则下载 url
        let fileBuffer: Buffer;
        if (message.file_data) {
            fileBuffer = Buffer.from(message.file_data, 'base64');
        } else if (message.url) {
            const download = await axios.get<ArrayBuffer>(message.url, { responseType: 'arraybuffer' });
            fileBuffer = Buffer.from(download.data);
        } else {
            throw new Error('分片上传需要提供 file_data 或 url');
        }

        // 1. 预上传
        const preparePayload: FileUploadPreparePayload = {
            file_type: message.file_type,
            file_size: String(fileBuffer.length),
            file_name: message.file_name,
            md5: md5Hex(fileBuffer),
            sha1: sha1Hex(fileBuffer),
            md5_10m: md5Hex(fileBuffer.subarray(0, 10002432)), // 文件前 10002432 字节（约 10MB）的 MD5
        };
        const prepare = await this.request<UploadPrepareResponse>({
            method: 'POST',
            url: urls.prepareURL,
            rest: { openID },
            data: preparePayload,
        });
        const { upload_id, parts } = prepare.data;

        // 2/3. 逐片 PUT 到预签名 URL，并通知服务端该分片完成
        let offset = 0;
        for (const part of parts) {
            const partSize = Number(part.block_size);
            const chunk = fileBuffer.subarray(offset, offset + partSize);
            offset += partSize;
            await axios.put(part.presigned_url, chunk);

            const partFinishPayload: FileUploadPartFinishPayload = {
                upload_id,
                part_index: part.index,
                block_size: part.block_size,
                md5: md5Hex(chunk),
            };
            await this.request({
                method: 'POST',
                url: urls.partFinishURL,
                rest: { openID },
                data: partFinishPayload,
            });
        }
        // 4. 全部分片完成后，携带 upload_id 完成合并
        return this.request<MediaUploadResponse>({
            method: 'POST',
            url: urls.mergeURL,
            rest: { openID },
            data: {
                file_type: message.file_type,
                file_name: message.file_name,
                upload_id,
                srv_send_msg: message.srv_send_msg,
            },
        });
    }
}
