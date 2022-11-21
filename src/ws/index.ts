import { EventEmitter, WebSocket } from "ws";
import { buildFetch, toObject } from "../utils";
import { AvailableIntentsEventsEnum, GetWsParam, IntentEvents, OpCode, SessionEvents, WsEventType, wsResData } from "../types";

export class WebsocketClient extends EventEmitter {

    alive = false;
    ws!: WebSocket;
    config: GetWsParam;
    isReconnect: boolean;
    heartbeatInterval!: number;
    heartbeatParam = { op: OpCode.HEARTBEAT, d: null, };
    sessionRecord = { sessionID: '', seq: 0, };

    constructor(config: GetWsParam) {
        super();
        this.config = config;
        this.isReconnect = false;
    }

    async connect() {
        const gateway = await (await buildFetch(this.config, "/gateway/bot")).json();
        this.ws = new WebSocket(gateway.url);

        this.ws.on('open', () => {
            console.info(`[CLIENT] 开启`);
        });

        this.ws.on('message', (data: wsResData) => {
            const res = toObject(data)

            if (res?.op === OpCode.HELLO && res?.d?.heartbeat_interval) {
                this.heartbeatInterval = res.d.heartbeat_interval;
                this.isReconnect ? this.reconnectWs() : this.authWs();
                return;
            }

            if (res.t === SessionEvents.READY) {
                console.log(`[CLIENT] 鉴权通过`);
                const { d, s } = res;
                const { session_id } = d;
                if (session_id && s) {
                    this.sessionRecord.sessionID = session_id;
                    this.sessionRecord.seq = s;
                    this.heartbeatParam.d = s;
                }
                console.log(`[CLIENT] 发送第一次心跳`, this.heartbeatParam);
                this.sendWs(this.heartbeatParam);
                return;
            }

            if (res.op === OpCode.HEARTBEAT_ACK || res.t === SessionEvents.RESUMED) {
                if (!this.alive) {
                    this.alive = true;
                }
                console.log('[CLIENT] 心跳校验', this.heartbeatParam);
                setTimeout(() => {
                    this.sendWs(this.heartbeatParam);
                }, this.heartbeatInterval);
            }

            if (res.op === OpCode.DISPATCH) {
                const { s } = res;
                if (s) {
                    this.sessionRecord.seq = s;
                    this.heartbeatParam.d = s;
                }
                this.dispatchEvent(res.t, res);
            }
        });

        this.ws.on('close', (data: number) => {
            console.info('[CLIENT] 连接关闭', data);
        });

        this.ws.on('error', () => {
            console.error(`[CLIENT] 连接错误`);
        });

        return this;
    }

    reconnectWs() {
        const reconnectParam = {
            op: OpCode.RESUME,
            d: {
                token: `Bot ${this.config.appID}.${this.config.token}`,
                session_id: this.sessionRecord.sessionID,
                seq: this.sessionRecord.seq,
            },
        };
        this.sendWs(reconnectParam);
    }


    dispatchEvent(eventType: string, res: wsResData) {
        const msg = res.d;
        const eventId = res.id || '';
        if (!msg || !eventType) return;
        this.emit(WsEventType[eventType], { eventType, eventId, msg });
    }

    sendWs(msg: any) {
        this.ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }

    authWs() {
        this.sendWs({
            op: OpCode.IDENTIFY,
            d: {
                token: `Bot ${this.config.appID}.${this.config.token}`,
                intents: this.getValidIntents(),
                shard: this.checkShards(this.config.shards) || [0, 1],
            },
        });
    }

    checkShards(shardsArr: number[] | undefined) {
        if (!shardsArr) return console.log('shards 不存在');
        if (shardsArr.length === 2 && shardsArr[0] < shardsArr[1]) return shardsArr;
        return console.log('shards 错误');
    }

    getValidIntents() {
        const intentsIn = this.getValidIntentsType();
        if (intentsIn.length > 0) {
            const intents = { value: 0 };
            if (intentsIn.length === 1) {
                intents.value = IntentEvents[intentsIn[0]];
                return intents.value;
            }
            for (const e of intentsIn) {
                intents.value = IntentEvents[e] | intents.value;
            }
            return intents.value;
        }
    }

    getValidIntentsType(): AvailableIntentsEventsEnum[] {
        const intentsIn = this.config.intents;
        const defaultIntents = Object.keys(AvailableIntentsEventsEnum) as AvailableIntentsEventsEnum[];
        if (!intentsIn) {
            console.log('[CLIENT] intents不存在，默认开启全部监听事件');
            return defaultIntents;
        }
        if (intentsIn.length === 0) {
            console.log('[CLIENT] intents为空，默认开启全部监听事件');
            return defaultIntents;
        }
        if (intentsIn.length > defaultIntents.length) {
            console.log('[CLIENT] intents中的监听事件大于可监听数，仅开启有效监听事件');
        }
        const typeIn = intentsIn.every((item) => typeof item === 'string');
        if (!typeIn) {
            console.log('[CLIENT] intents中存在不合法类型，仅开启有效监听事件');
            return intentsIn.filter((item) => typeof item === 'string');
        }
        return intentsIn;
    }
}