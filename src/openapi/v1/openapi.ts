/* eslint-disable prefer-promise-reject-errors */
import { register } from '@src/openapi/openapi';
import resty, { RequestOptions, RestyResponse } from 'resty-client';
import PinsMessage from './pins-message';
import Reaction from './reaction';
import Guild from './guild';
import Channel from './channel';
import Me from './me';
import Message from './message';
import Member from './member';
import Role from './role';
import DirectMessage from './direct-message';
import ChannelPermissions from './channel-permissions';
import Audio from './audio';
import Mute from './mute';
import Announce from './announce';
import Schedule from './schedule';
import GuildPermissions from './guild-permissions';
import Interaction from './interaction';
import Group from './group';
import C2C from './c2c';
import { GuildAPI, ChannelAPI, MeAPI, MessageAPI, Config, IOpenAPI, MemberAPI, RoleAPI, DirectMessageAPI, ChannelPermissionsAPI, AudioAPI, MuteAPI, ScheduleAPI, AnnounceAPI, GuildPermissionsAPI, ReactionAPI, PinsMessageAPI, InteractionAPI, GroupAPI, C2CAPI } from '@src/types';
import { WebhookAPI } from '@src/utils/webhook';
import { addUserAgent, buildUrl } from '@src/utils/utils';
export const apiVersion = 'v1';
export class OpenAPI implements IOpenAPI {
  static newClient(config: Config) {
    return new OpenAPI(config);
  }

  config: Config;
  public guildApi!: GuildAPI;
  public channelApi!: ChannelAPI;
  public meApi!: MeAPI;
  public messageApi!: MessageAPI;
  public memberApi!: MemberAPI;
  public roleApi!: RoleAPI;
  public muteApi!: MuteAPI;
  public announceApi!: AnnounceAPI;
  public scheduleApi!: ScheduleAPI;
  public directMessageApi!: DirectMessageAPI;
  public channelPermissionsApi!: ChannelPermissionsAPI;
  public audioApi!: AudioAPI;
  public reactionApi!: ReactionAPI;
  public interactionApi!: InteractionAPI;
  public pinsMessageApi!: PinsMessageAPI;
  public guildPermissionsApi!: GuildPermissionsAPI;
  public groupApi!: GroupAPI;
  public c2cApi!: C2CAPI;
  public webhookApi!: WebhookAPI;
  public accessToken: string;
  public tokenExpires: number;

  constructor(config: Config) {
    this.config = config;
    this.tokenExpires = -1;
    this.accessToken = '';
    this.register(this);
  }

  public register(client: IOpenAPI) {
    // 注册聚合client
    client.guildApi = new Guild(this.request, this.config);
    client.channelApi = new Channel(this.request, this.config);
    client.meApi = new Me(this.request, this.config);
    client.messageApi = new Message(this.request, this.config);
    client.memberApi = new Member(this.request, this.config);
    client.roleApi = new Role(this.request, this.config);
    client.muteApi = new Mute(this.request, this.config);
    client.announceApi = new Announce(this.request, this.config);
    client.scheduleApi = new Schedule(this.request, this.config);
    client.directMessageApi = new DirectMessage(this.request, this.config);
    client.channelPermissionsApi = new ChannelPermissions(this.request, this.config);
    client.audioApi = new Audio(this.request, this.config);
    client.guildPermissionsApi = new GuildPermissions(this.request, this.config);
    client.reactionApi = new Reaction(this.request, this.config);
    client.interactionApi = new Interaction(this.request, this.config);
    client.pinsMessageApi = new PinsMessage(this.request, this.config);
    client.groupApi = new Group(this.request, this.config);
    client.c2cApi = new C2C(this.request, this.config);
    client.webhookApi = new WebhookAPI(this.request, this.config);
  }
  // 基础rest请求
  public async request<T extends Record<any, any> = any>(options: RequestOptions): Promise<RestyResponse<T>> {
    const { appID, token, secret } = this.config;

    options.headers = { ...options.headers };

    // 添加 UA
    addUserAgent(options.headers);

    //是否使用固定token
    if (!secret && token) {
      options.headers['Authorization'] = `Bot ${appID}.${token}`;
    } else {
      if (!this.tokenExpires || this.tokenExpires < Date.now()) {
        const tokenResp = await resty.create().post<{
          access_token: string;
          expires_in: string;
        }>('https://bots.qq.com/app/getAppAccessToken', {
          data: {
            appId: appID,
            clientSecret: secret,
          },
        });

        if (!tokenResp.data.access_token || !tokenResp.data.expires_in) {
          throw new Error(`access_token 响应格式错误: ${JSON.stringify(tokenResp.data)}`);
        }

        this.accessToken = tokenResp.data.access_token;
        this.tokenExpires = Date.now() + parseInt(tokenResp.data.expires_in) * 1000;
      }

      // 添加鉴权信息
      options.headers['Authorization'] = `QQBot ${this.accessToken}`;
    }

    // 组装完整Url
    const botUrl = buildUrl(options.url, this.config.sandbox);

    // 简化错误信息，后续可考虑通过中间件形式暴露给用户自行处理
    resty.useRes(
      (result) => result,
      (error) => {
        let traceid = error?.response?.headers?.['x-tps-trace-id'];
        if (error?.response?.data) {
          return Promise.reject({
            ...error.response.data,
            traceid,
          });
        }
        if (error?.response) {
          return Promise.reject({
            ...error.response,
            traceid,
          });
        }
        return Promise.reject(error);
      },
    );

    const client = resty.create(options);
    return client.request<T>(botUrl!, options);
  }
}

export function v1Setup() {
  register(apiVersion, OpenAPI);
}
