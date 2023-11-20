# QQ 机器人 SDK qq-bot-sdk

QQ 机器人 SDK，基于 [官方 SDK](https://github.com/tencent-connect/bot-node-sdk) 改版而来，增加群消息接收与发送功能，修复诸多错误

# 对比优化内容

## 新增群消息订阅事件

```js
ws.on(AvailableIntentsEventsEnum.CHAT, async (data) => {
    console.log("[CHAT] 事件接收 :", data);
});
```

## 新增群消息发送功能

```js
await client.groupApi
    .postMessage(data.msg.group_id, {
        content: "hello world",
        msg_id: data.msg.id,
    })
    .then((res) => {
        console.log(res.data);
    }); // 发送消息

await client.groupApi
    .postFile(data.msg.group_id, {
        file_type: 1,
        url: "文件url",
        srv_send_msg: true,
    })
    .then((res) => {
        console.log(res.data);
    }); // 发送文件
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
