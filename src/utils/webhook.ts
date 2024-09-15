import { ed25519 } from '@noble/curves/ed25519';
import { Config, OpenAPIRequest } from '@src/types';


export class WebhookAPI {
    private request: OpenAPIRequest;
    private config: Config;
    constructor(request: OpenAPIRequest, config: Config) {
        this.request = request;
        this.config = config;
    }

    /**
     * 用于校验消息正文，对于所有正文全部适用
     * 
     * __注意：需要设置 `secret` 才可使用，否则会抛出错误__
     * @param ts 时间戳，从 `header` 中 `x-signature-timestamp` 字段获取
     * @param body 收到的消息正文，需要以源文本传入
     * @param sign sign签名，从 `header` 中的 `x-signature-ed25519` 字段获取
     * @returns 返回 `true`/`false` 布尔值，代表是否通过了校验
     */
    validSign(ts: string, body: string | Buffer, sign: string | Buffer): boolean {
        const { publicKey } = this.getKey();
        const sig = Buffer.isBuffer(sign) ? sign : Buffer.from(sign, "hex");
        const httpBody = Buffer.from(body);
        const msg = Buffer.from(ts + httpBody);
        return ed25519.verify(sig, msg, publicKey);
    }

    /**
     * 校验 url 时用到的函数，此时消息正文（使用 `body` 表示）中 `body.d = 13`
     * 
     * __注意：需要设置 `secret` 才可使用，否则会抛出错误__
     * @param eventTs 从消息正文中获取 `body.d.event_ts`
     * @param plainToken 从消息正文中获取 `body.d.plain_token`
     * @returns 返回 `sign` 签名，使用 `{ plain_token: plainToken, signature: sign }` 的 json 形式对 webhook 做出回应
     */
    getSign(eventTs: string, plainToken: string): string {
        const { privateKey } = this.getKey();
        const msg = Buffer.from(eventTs + plainToken);
        const signature = Buffer.from(ed25519.sign(msg, privateKey)).toString("hex");
        return signature;
    }

    /**
     * 通过 `secret` 进行 `ed25519` 密钥算法获取 `key`
     * 
     * __注意：需要设置 `secret` 才可使用，否则会抛出错误__
     * @returns 返回 `privateKey` 与 `publicKey`
     */
    getKey() {
        let seed = this.config.secret;
        if (!seed) throw new Error("secret not set, can't calc ed25519 key");

        while (seed.length < 32) seed = seed.repeat(2); // Ed25519 的种子大小是 32 字节
        seed = seed.slice(0, 32); // 修剪到 32 字节

        const privateKey = Buffer.from(seed);
        return {
            privateKey,
            publicKey: ed25519.getPublicKey(privateKey),
        };
    }
}