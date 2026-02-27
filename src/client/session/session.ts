import resty from 'resty-client';
import { EventEmitter } from 'ws';
import { addAuthorization } from '@src/utils/utils';
import { Ws } from '@src/client/websocket/websocket';
import { GetWsParam, SessionEvents, SessionRecord, WsObjRequestOptions, ConfigLogger } from '@src/types';

export default class Session {
    config: GetWsParam & ConfigLogger;
    heartbeatInterval!: number;
    ws!: Ws;
    event!: EventEmitter;
    sessionRecord: SessionRecord | undefined;

    constructor(config: GetWsParam & ConfigLogger, event: EventEmitter, sessionRecord?: SessionRecord) {
        this.config = config;
        this.event = event;
        // 如果会话记录存在的话，继续透传
        if (sessionRecord) {
            this.sessionRecord = sessionRecord;
        }
        this.createSession();
    }

    // 新建会话
    async createSession() {
        this.ws = new Ws(this.config, this.event, this.sessionRecord || undefined);
        // 拿到 ws地址等信息
        const reqOptions = WsObjRequestOptions(this.config.sandbox as boolean);

        // 如果有secret，先获取access_token
        if (this.config.secret) {
            try {
                const tokenResp = await resty.create().post<{
                    access_token: string;
                    expires_in: string;
                }>('https://bots.qq.com/app/getAppAccessToken', {
                    data: {
                        appId: this.config.appID,
                        clientSecret: this.config.secret,
                    },
                });

                if (tokenResp.data.access_token) {
                    this.config.token = tokenResp.data.access_token;
                    // 更新ws中的config引用
                    this.ws.config.token = this.config.token;
                    reqOptions.headers['Authorization'] = `QQBot ${this.config.token}`;
                } else {
                    throw new Error('获取access_token失败');
                }
            } catch (e) {
                this.config.logger.info('[ERROR] getAccessToken: ', e);
                this.event.emit(SessionEvents.EVENT_WS, {
                    eventType: SessionEvents.DISCONNECT,
                    eventMsg: this.sessionRecord,
                });
                return;
            }
        } else {
            addAuthorization(reqOptions.headers, this.config.appID, this.config.token);
        }

        resty
            .create(reqOptions)
            .get(reqOptions.url as string, {})
            .then((r) => {
                const wsData = r.data;
                if (!wsData) throw new Error('获取ws连接信息异常');
                this.ws.createWebsocket(wsData);
            })
            .catch((e) => {
                this.config.logger.info('[ERROR] createSession: ', e);
                this.event.emit(SessionEvents.EVENT_WS, {
                    eventType: SessionEvents.DISCONNECT,
                    eventMsg: this.sessionRecord,
                });
            });
    }

    // 关闭会话
    closeSession() {
        this.ws.closeWs();
    }
}
