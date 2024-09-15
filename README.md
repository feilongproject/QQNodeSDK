# QQ 机器人 SDK qq-bot-sdk

QQ 机器人 SDK，基于 [官方 SDK](https://github.com/tencent-connect/bot-node-sdk) 改版而来，增加群消息接收与发送功能，修复诸多错误

# 使用方法

## 安装

```shell
npm i qq-bot-sdk --registry=https://registry.npmjs.org
```

## `webhook` 方式使用（新增）

详情请见 `example` 中[`webhook`](/example/webhook) 使用案例

## `websocket` 方式引用

> 可参见[example](/example)中样例

```js
const { createOpenAPI, createWebsocket, AvailableIntentsEventsEnum } = require("qq-bot-sdk"); // commonjs引用方法
import { createOpenAPI, createWebsocket, AvailableIntentsEventsEnum } from "qq-bot-sdk"; // es引用方法
// 注意：以上两种引用方法只能选择一种方式使用！

const testConfigWs = {
    appID: "APPID",
    token: "TOKEN",
    intents: [AvailableIntentsEventsEnum.GUILD_MESSAGES], // 设置监听类型
};

const client = createOpenAPI(testConfigWs); // 创建client实例（用于发送消息）
const ws = createWebsocket(testConfigWs); // 创建ws实例（用于接收消息）
```

# 对比优化内容

## 新增 `webhook` 方式调用

详情请见 `example` 中[`webhook`](/example/webhook) 使用案例

## 新增群消息订阅事件

```js
ws.on(AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT, async (data) => {
    console.log("[GROUP_AND_C2C_EVENT] 事件接收 :", data);
});
```

## 新增 群&私聊 场景下，消息发送功能

> 注意：群聊场景下请使用 `client.groupApi`，私聊场景下请使用 `client.c2cApi`，后方内容基本相同

### 发送富媒体文件（主动）

```js
await client.groupApi
    .postFile(data.msg.group_id, {
        file_type: 1, // 参数: 1.图片 2.视频 3.语音 4.文件（暂不开放）// 文件格式: 图片png/jpg 视频mp4 语音silk
        url: "文件url", // 填入要发送的文件 url
        srv_send_msg: true, // 为 true 时，消息会直接发送到目标端，占用主动消息频次，超频会发送失败。
    })
    .then((res) => {
        console.log(res.data);
    }); // 主动发送文件
```

### 发送文本消息

```js
await client.groupApi
    .postMessage(data.msg.group_id, {
        content: "hello world", // 填入要回复的内容
        msg_id: data.msg.id, // 被动回复需要带上 msg_id （有效期为5分钟）
        msg_seq: 1, // 回复消息的序号，与 msg_id 联合使用，避免相同消息id回复重复发送，不填默认是1(非sdk默认)。相同的 msg_id + msg_seq 重复发送会失败。
    })
    .then((res) => {
        console.log(res.data);
    }); // 发送消息
```

### 发送图文混排/被动 富媒体

> 请妥善利用发送文件时返回的 ttl 做好缓存处理

```js
const fileRes = await client.groupApi.postFile(data.msg.group_id, {
    file_type: 1, // 参数见上文
    url: "https://www.w3school.com.cn/i/eg_tulip.jpg",
    srv_send_msg: false, // 设置为 false 不发送到目标端，仅拿到文件信息
}); // 拿到文件信息
await client.groupApi.postMessage(data.msg.group_id, {
    msg_type: 7, // 发送富媒体
    content: "这是图文混排消息", // 当且仅当文件为图片时，才能实现图文混排，其余类型文件 content 会被忽略
    media: { file_info: fileRes.data.file_info },
    msg_id: data.msg.id,
}); // 通过文件信息发送文件
```

# 本地开发

```sh
git clone https://github.com/feilongproject/QQNodeSDK.git # 克隆仓库

cd QQNodeSDK

npm run dev # 开启开发环境，代码更改时实时更新

npm run linkdev # 将example下的 qq-bot-sdk 包环境链接到开发环境

node example/index.js # 开始测试

```

# 参与共建

-   👏 如果您有针对 SDK 的错误修复，请以分支`fix/xxx`向`main`分支发 PR
-   👏 如果您有新的内容贡献，请以分支`feature/xxx`向`main`分支发起 PR
-   👏 您如果在使用 SDK 中有任何问题，可以[提出 `issues`](https://github.com/feilongproject/QQNodeSDK/issues/new/choose)（但是请遵循[提问的智慧](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md)）

# 注意

这并不是一个官方 SDK，这只是因为官方 SDK 长时间不维护，而在官方基础上改出的 SDK，本 SDK 带来的所有影响与官方无关
