# 简介

基于官方文档 https://bot.q.qq.com/wiki/develop/api-v2/dev-prepare/interface-framework/event-emit.html 实现

此案例中 `web` 服务基于 `koa2` + `koa-router` + `koa-body` 的 `http` 服务, 官方需要使用 `https` 协议 `443`端口(其余端口亲测无法验证), 因此需要 `nginx` 设置 `ssl` 反代， `nginx` 代理设置详见同级目录下的 `nginx.conf`

> `webhook` 相关功能需要在设置了 `secret` 情况下使用，此时仍要设置 `token`

详细流程详见 `index.js` 代码内解释
