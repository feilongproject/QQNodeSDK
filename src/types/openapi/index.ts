import { RequestOptions, RestyResponse } from 'resty-client';
import { AudioAPI } from './v1/audio';
import { ChannelAPI } from './v1/channel';
import { ChannelPermissionsAPI } from './v1/channel-permission';
import { DirectMessageAPI } from './v1/direct-message';
import { GuildAPI } from './v1/guild';
import { MeAPI } from './v1/me';
import { MemberAPI } from './v1/member';
import { MessageAPI } from './v1/message';
import { RoleAPI } from './v1/role';
import { MuteAPI } from './v1/mute';
import { AnnounceAPI } from './v1/announce';
import { ScheduleAPI } from './v1/schedule';
import { ReactionAPI } from './v1/reaction';
import { InteractionAPI } from './v1/interaction';
import { PinsMessageAPI } from './v1/pins-message';
import { GuildPermissionsAPI } from './v1/guild-permission';
import { GroupAPI } from "./v1/group";
import { C2CAPI } from "./v1/c2c";
import { WebhookAPI } from '@src/utils/webhook';

export type OpenAPIRequest = <T extends Record<any, any> = any>(options: RequestOptions) => Promise<RestyResponse<T>>;

export interface Config {
    appID: string;
    token: string;
    sandbox?: boolean;
    secret?: string;
}

export interface ConfigLogger {
    logger: Logger;
}

export interface Logger {
    info: (message: any, ...args: any[]) => void;
}

export interface IOpenAPI {
    config: Config;
    request: OpenAPIRequest;
    guildApi: GuildAPI;
    channelApi: ChannelAPI;
    meApi: MeAPI;
    messageApi: MessageAPI;
    memberApi: MemberAPI;
    roleApi: RoleAPI;
    muteApi: MuteAPI;
    announceApi: AnnounceAPI;
    scheduleApi: ScheduleAPI;
    directMessageApi: DirectMessageAPI;
    channelPermissionsApi: ChannelPermissionsAPI;
    audioApi: AudioAPI;
    guildPermissionsApi: GuildPermissionsAPI;
    reactionApi: ReactionAPI;
    interactionApi: InteractionAPI;
    pinsMessageApi: PinsMessageAPI;
    groupApi: GroupAPI;
    c2cApi: C2CAPI;
    webhookApi: WebhookAPI;
}

export type APIVersion = `v${number}`;

export interface Token {
    appID: number;
    accessToken: string;
    type: string;
}

// WebsocketAPI websocket 接入地址
export interface WebsocketAPI {
    ws: () => any;
}

export * from './v1/audio';
export * from './v1/channel';
export * from './v1/channel-permission';
export * from './v1/direct-message';
export * from './v1/guild';
export * from './v1/me';
export * from './v1/member';
export * from './v1/message';
export * from './v1/role';
export * from './v1/mute';
export * from './v1/announce';
export * from './v1/schedule';
export * from './v1/reaction';
export * from './v1/interaction';
export * from './v1/pins-message';
export * from './v1/guild-permission';
export * from './v1/group';
export * from './v1/c2c';
