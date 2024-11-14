import { EventEmitter } from 'ws';
import Session from '@src/client/session/session';
import { GetWsParam, SessionEvents, SessionRecord, WebsocketCloseReason, ConfigLogger } from '@src/types';

const MAX_RETRY = 10;

export default class WebsocketClient extends EventEmitter {
  session!: Session;
  retry = 0;

  constructor(config: GetWsParam & ConfigLogger) {
    super();
    this.connect(config);

    this.on(SessionEvents.EVENT_WS, (data) => {
      switch (data.eventType) {
        case SessionEvents.RECONNECT:
          config.logger.info('[CLIENT] 等待断线重连中...');
          break;
        case SessionEvents.DISCONNECT:
          if (this.retry < (config.maxRetry || MAX_RETRY)) {
            config.logger.info('[CLIENT] 重新连接中，尝试次数：', this.retry + 1);
            this.connect(config, WebsocketCloseReason.find((v) => v.code === data.code)?.resume ? data.eventMsg : null);
            this.retry += 1;
          } else {
            config.logger.info('[CLIENT] 超过重试次数，连接终止');
            this.emit(SessionEvents.DEAD, { eventType: SessionEvents.ERROR, msg: '连接已死亡，请检查网络或重启' });
          }
          break;
        case SessionEvents.READY:
          config.logger.info('[CLIENT] 连接成功');
          this.retry = 0;
          break;
        default:
      }
    });
  }

  // 连接
  connect(config: GetWsParam & ConfigLogger, sessionRecord?: SessionRecord) {
    const event = this;
    // 新建一个会话
    this.session = new Session(config, event, sessionRecord);
    return this.session;
  }

  // 断开连接
  disconnect() {
    // 关闭会话
    this.session.closeSession();
  }
}
