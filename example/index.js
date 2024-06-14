// 以下仅为用法示意，详情请参照文档：https://bot.q.qq.com/wiki/develop/nodesdk/
const { createOpenAPI, createWebsocket, AvailableIntentsEventsEnum } = require('qq-bot-sdk');

const testConfigWs = {
    appID: '',
    token: '',
    intents: [AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT],
};

const client = createOpenAPI(testConfigWs);

const ws = createWebsocket(testConfigWs);
ws.on('READY', (wsdata) => {
    console.log('[READY] 事件接收 :', wsdata);
});

ws.on('ERROR', (data) => {
    console.log('[ERROR] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.GUILDS, (data) => {
    console.log('[GUILDS] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.GUILD_MEMBERS, (data) => {
    console.log('[GUILD_MEMBERS] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.GUILD_MESSAGES, (data) => {
    console.log('[GUILD_MESSAGES] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.GUILD_MESSAGE_REACTIONS, (data) => {
    console.log('[GUILD_MESSAGE_REACTIONS] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.DIRECT_MESSAGE, (data) => {
    console.log('[DIRECT_MESSAGE] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.INTERACTION, (data) => {
    console.log('[INTERACTION] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.MESSAGE_AUDIT, (data) => {
    console.log('[MESSAGE_AUDIT] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.FORUMS_EVENT, (data) => {
    console.log('[FORUMS_EVENT] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.AUDIO_ACTION, (data) => {
    console.log('[AUDIO_ACTION] 事件接收 :', data);
});
ws.on(AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES, async (data) => {
    console.log('[PUBLIC_GUILD_MESSAGES] 事件接收 :', data);

    // ===== 下方为发送消息接口，请按需取消注释 ======

    // await client.messageApi.postMessage(data.msg.channel_id, {
    //     content: '测试信息'
    // }); // 发送频道消息
});

ws.on(AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT, async (data) => {
    console.log('[GROUP_AND_C2C_EVENT] 事件接收 :', data);

    // ===== 下方为发送消息接口，请按需取消注释 ======

    // await client.c2cApi.postMessage(data.msg.author.id, {
    //     content: "测试文本",
    //     msg_id: data.msg.id,
    // });

    // await client.groupApi.postMessage(data.msg.group_id, {
    //     content: "测试文本",
    //     msg_id: data.msg.id,
    //     msg_seq: Math.round(Math.random() * (1 << 30)), // 回复消息的序号，与 msg_id 联合使用，避免相同消息id回复重复发送，不填默认是1。相同的 msg_id + msg_seq 重复发送会失败。
    // }).then(res => {
    //     console.log(res.data);
    // }); // 发送群消息

    // await client.groupApi.postFile(data.msg.group_id, {
    //     file_type: 1, // 参数: 1.图片 2.视频 3.语音 4.文件（暂不开放）// 文件格式: 图片png/jpg 视频mp4 语音silk
    //     url: "https://www.w3school.com.cn/i/eg_tulip.jpg",
    //     srv_send_msg: true, // 为 true 时，消息会直接发送到目标端，占用主动消息频次，超频会发送失败。
    // }).then(res => {
    //     console.log(res.data);
    // }); // 主动发送群文件

    // const fileRes = await client.groupApi.postFile(data.msg.group_id, {
    //     file_type: 1, // 参数见上文
    //     url: "https://www.w3school.com.cn/i/eg_tulip.jpg",
    //     srv_send_msg: false, // 设置为 false 不发送到目标端，仅拿到文件信息
    // }); // 拿到文件信息
    // console.log(fileRes.data);
    // await client.groupApi.postMessage(data.msg.group_id, {
    //     msg_type: 7, // 发送富媒体
    //     content: "这是图文混排消息", // 当且仅当文件为图片时，才能实现图文混排，其余类型文件 content 会被忽略
    //     media: { file_info: fileRes.data.file_info },
    //     msg_id: data.msg.id,
    // }).then(res => console.log(res.data)); // 通过文件信息发送文件

});

