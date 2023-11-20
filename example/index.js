// 以下仅为用法示意，详情请参照文档：https://bot.q.qq.com/wiki/develop/nodesdk/
const { createOpenAPI, createWebsocket, AvailableIntentsEventsEnum } = require('qq-bot-sdk');

const testConfigWs = {
    appID: '',
    token: '',
    intents: [AvailableIntentsEventsEnum.CHAT],
};

const client = createOpenAPI(testConfigWs);

const ws = createWebsocket(testConfigWs);
ws.on('READY', (wsdata) => {
    console.log('[READY] 事件接收 :', wsdata);
});

ws.on('ERROR', (data) => {
    console.log('[ERROR] 事件接收 :', data);
});
ws.on('GUILDS', (data) => {
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
ws.on(AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES, async (eventData) => {
    console.log('[PUBLIC_GUILD_MESSAGES] 事件接收 :', eventData);
    const { data } = await client.messageApi.postMessage('', {
        content: 'test'
    })
    console.log(data);
});

ws.on(AvailableIntentsEventsEnum.CHAT, async (data) => {
    console.log('[CHAT] 事件接收 :', data.msg);

    await client.groupApi.postMessage(data.msg.group_id, {
        content: "",
        msg_id: data.msg.id,
    }).then(res => {
        console.log(res.data);
    });

    await client.groupApi.postFile(data.msg.group_id, {
        file_type: 1,
        url: "",
        srv_send_msg: true,
    }).then(res => {
        console.log(res.data);
    });
});

