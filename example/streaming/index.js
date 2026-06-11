const { createOpenAPI, AvailableIntentsEventsEnum } = require('qq-bot-sdk');

const testConfigWs = {
    appID: '',
    token: '',
    intents: [AvailableIntentsEventsEnum.GROUP_AND_C2C_EVENT],
};
const client = createOpenAPI(testConfigWs);

async function streamReply(params) {
    const { openid, eventId, msgId, snapshots } = params;

    let streamMsgId = undefined;
    const msgSeq = Math.floor(Math.random() * 65536);

    for (let index = 0; index < snapshots.length; index++) {
        const isLast = index === snapshots.length - 1;
        console.info(`发送消息快照 ${index + 1}/${snapshots.length}，内容：${snapshots[index]}`);

        const resp = await client.c2cApi.postStreamingMessage(openid, {
            input_mode: 'replace',
            input_state: isLast ? 10 : 1,
            content_type: 'markdown',
            content_raw: snapshots[index],
            event_id: eventId,
            msg_id: msgId,
            ...(streamMsgId ? { stream_msg_id: streamMsgId } : {}),
            msg_seq: msgSeq,
            index,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟消息生成的时间间隔

        if (!streamMsgId) {
            streamMsgId = resp.data.id;
        }
    }
}

// 示例
streamReply({
    openid: '',
    eventId: '',
    msgId: '',
    snapshots: ['你', '你好', '你好，世界'],
}).catch(console.error);
