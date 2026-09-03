# QQ 机器人 SDK qq-bot-sdk

QQ 机器人 SDK，基于 [官方 SDK](https://github.com/tencent-connect/bot-node-sdk) 改版而来，增加群聊与 c2c 场景的适配，支持 webhook，修复诸多错误

# 使用方法

## 安装

```shell
npm i qq-bot-sdk --registry=https://registry.npmjs.org
```

## `webhook` 方式使用（新增）

详情请见 `example` 中[`webhook`](/example/webhook) 使用案例

## `streaming` 方式发送消息

详情请见 `example` 中[`streaming`](/example/streaming) 使用案例，部分源码参照 `@openclaw/qqbot`

## `websocket` 方式引用

> 可参见[example](/example)中样例

```js
const { createOpenAPI, createWebsocket, AvailableIntentsEventsEnum } = require("qq-bot-sdk"); // commonjs 引用方法
import { createOpenAPI, createWebsocket, AvailableIntentsEventsEnum } from "qq-bot-sdk"; // es 引用方法
// 注意：以上两种引用方法只能选择一种方式使用！

const testConfigWs = {
    appID: "APPID",
    token: "TOKEN",
    intents: [AvailableIntentsEventsEnum.GUILD_MESSAGES], // 设置监听类型
};

const client = createOpenAPI(testConfigWs); // 创建 client 实例（用于发送消息）
const ws = createWebsocket(testConfigWs); // 创建 ws 实例（用于接收消息）
```

# 对比优化内容

## 新增自定义 logger 功能

详情请见 `example` 中[`index.js`](/example/index.js) 使用案例

```js
const testConfigWs = {
    appID: '',
    token: '',
    intents: [AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT],

    // 以下是使用 log4js 用法, configure 中填写你自己的 logger 配置
    logger: log4js.configure(...).getLogger(),
};
const ws = createWebsocket(testConfigWs);
```

## 新增 `webhook` 方式调用

详情请见 `example` 中[`webhook`](/example/webhook) 使用案例

## 新增事件

| 名称                    | intents | 包含事件                                                                                                                                                                                                                                  |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GROUP_AND_C2C_EVENT` | 1<<25   | `GROUP_ADD_ROBOT` 机器人加入群聊<br/>`GROUP_DEL_ROBOT` 机器人退出群聊<br/>`GROUP_MSG_RECEIVE` 群聊消息接收开启<br/>`GROUP_MSG_REJECT` 群聊消息接收关闭<br/>`FRIEND_ADD` 用户添加好友<br/>`FRIEND_DEL` 用户删除好友<br/>`C2C_MSG_RECEIVE` 单聊消息接收开启<br/>`C2C_MSG_REJECT` 单聊消息接收关闭 |
| `GROUP_MEMBER_EVENT`  | 1<<24   | `GROUP_MEMBER_ADD` 群成员加入<br/>`GROUP_MEMBER_REMOVE` 群成员退出<br/>`GROUP_JOIN_REQUEST` 用户申请加群事件                                                                                                                                            |

```js
ws.on(AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT, async (data) => {
    console.log("[GROUP_AND_C2C_EVENT] 事件接收 :", data);
});

ws.on(AvailableIntentsEventsEnum.GROUP_MEMBER_EVENT, async (data) => {
    console.log("[GROUP_MEMBER_EVENT] 事件接收 :", data);
});
```

## 新增 API

| 分类  | API                              | 方法                                                                                                                                                                                                                                                                                 |
| --- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 群聊  | `client.groupApi`                | `.postMessage()` 群消息、富媒体发送<br/>`.postFile()` 上传文件<br/>`.deleteMessage()` 撤回消息<br/>`.info()` 获取群基本信息<br/>`.botState()` 获取机器人群内状态<br/>`.joinRequestList()` 入群申请列表拉取<br/>`.approvalJoinRequest()` 入群申请审批<br/>`.restrictChatSetting()` 查询群禁言状态<br/>`.setRestrictChatSetting()` 设置群成员禁言 |
| 群聊  | `client.joinApprovalStrategyApi` | `.strategies()` 查询入群自动审批策略列表<br/>`.createStrategy()` 创建入群自动审批策略<br/>`.updateStrategy()` 修改入群自动审批策略<br/>`.deleteStrategy()` 删除入群自动审批策略<br/>`.executeStrategy()` 执行入群自动审批策略<br/>`.updateStrategyWhitelist()` 修改入群自动审批策略的白名单号码                                                        |
| 群聊  | `client.groupMemberApi`          | `.members()` 获取群成员列表<br/>`.member()` 获取群成员详细信息<br/>`.batchRemoveMembers()` 批量移除群成员<br/>`.memberBlacklist()` 查询群黑名单列表<br/>`.setMemberBlacklist()` 操作群黑名单                                                                                                                            |
| 单聊  | `client.c2cApi`                  | `.postStreamingMessage()` 发送流式消息<br/>`.postMessage()` 单聊消息、富媒体发送<br/>`.postFile()` 上传文件<br/>`.deleteMessage()` 撤回消息                                                                                                                                                                |
| 机器人 | `client.meApi`                   | `.generateUrlLink()` 生成分享链接<br/>`.getMenu()` 查询全局自定义菜单<br/>`.updateMenu()` 修改全局自定义菜单<br/>`.getPanels()` 查询指令面板列表<br/>`.createPanel()` 创建指令面板<br/>`.getPanel()` 查询指令面板详情<br/>`.updatePanel()` 修改指令面板<br/>`.deletePanel()` 删除指令面板<br/>`.updatePanelTarget()` 修改指令面板关联对象              |

### 发送富媒体文件（主动）

> 支持分片上传，默认不启用

```js
await client.groupApi
    .postFile(data.msg.group_id, {
        file_type: 1, // 参数: 1.图片 2.视频 3.语音 4.文件 // 文件格式: 图片png/jpg 视频mp4 语音silk
        url: "文件url", // 填入要发送的文件 url （不可与 file_data 一同使用）
        file_data: "", // 文件base64后的字符串 （不可与 url 一同使用）
        srv_send_msg: true, // 为 true 时，消息会直接发送到目标端，占用主动消息频次，超频会发送失败。
    }, true) // 为 true 时启用分片上传
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

- 👏 如果您有针对 SDK 的错误修复，请以分支`fix/xxx`向`main`分支发 PR
- 👏 如果您有新的内容贡献，请以分支`feature/xxx`向`main`分支发起 PR
- 👏 您如果在使用 SDK 中有任何问题，可以[提出 `issues`](https://github.com/feilongproject/QQNodeSDK/issues/new/choose)（但是请遵循[提问的智慧](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md)）

# 注意

这并不是一个官方 SDK，这只是因为官方 SDK 长时间不维护，而在官方基础上改出的 SDK，本 SDK 带来的所有影响与官方无关
