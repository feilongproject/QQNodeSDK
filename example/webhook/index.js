/**
 * 基于官方文档 https://bot.q.qq.com/wiki/develop/api-v2/dev-prepare/interface-framework/event-emit.html
 * nginx 代理设置详见同级目录下的 nginx.conf
 * 注意：webhook 相关功能需要在设置了 secret 情况下使用，此时仍要设置 token
 */
const { createOpenAPI } = require('qq-bot-sdk');

const Koa = require("koa");
const { koaBody } = require("koa-body");
const Router = require("koa-router");


const client = createOpenAPI({
    appID: "",
    token: "", // 如果不使用 websocket 可留空
    secret: "", // 如果使用 webhook 必填
}); // 创建 client


const PORT = 2333; // 定义 web 的端口, 需要与 nginx.conf 内端口一致
const app = new Koa(); // 定义 koa 实例
const router = new Router(); // 定义路由
app.use(async (ctx, next) => {
    let rawData = '';
    ctx.req.on('data', chunk => rawData += chunk);
    ctx.req.on('end', () => ctx.request.rawBody = rawData);
    await next();
}); // 对 body 进行验证需要原数据 (格式化后无法使用)

router.post("/webhook", async (ctx, next) => {
    const sign = ctx.req.headers["x-signature-ed25519"]; // 获取服务器传来的 sign
    const timestamp = ctx.req.headers["x-signature-timestamp"]; // 获取服务器传来的 timestamp
    const rawBody = ctx.request.rawBody; // 获取原数据用来进行验证
    const isValid = client.webhookApi.validSign(timestamp, rawBody, sign); // 进行验证, 通过后才可继续执行下一步操作
    if (!isValid) {
        ctx.status = 400;
        ctx.body = { msg: "invalid signature" };
        return;
    }// 没有通过验证就一边玩去

    const body = ctx.request.body;

    if (body.op == 13) return ctx.body = {
        plain_token: body.d.plain_token,
        signature: client.webhookApi.getSign(body.d.event_ts, body.d.plain_token),
    }; // 当 op = 13 进行 webhook 验证

    /**
     * 
     * 此处已经正式通过验证, 你可以对数据做出相应的处理(如回复消息), 数据格式遵从 websocket 接收到的格式
     * 
     */
    console.log(body);


}); // 监听对应的url 

app.use(async (ctx, next) => {
    await next();
    ctx.status = ctx.body?.status || ctx.status || 200;
}); // 返回的 body 里面如果有 status 时, 则返回的 status 设置为与之相同的值
app.use(koaBody({ multipart: true })); // 使用 koaBody
app.use(router.routes()); // 使用路由
app.use(router.allowedMethods()); // 使用路由
app.listen(PORT, async () => {
    console.log("webhook 服务运行中......");
}); // 正式监听相应的端口

