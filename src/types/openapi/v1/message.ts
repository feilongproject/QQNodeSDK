import { RestyResponse } from 'resty-client';
import { IMember } from './guild';
import { IUser } from './me';

/**
 * =============  Message 消息接口  =============
 */
export interface MessageAPI {
  message: (channelID: string, messageID: string) => Promise<RestyResponse<IMessageRes>>;
  messages: (channelID: string, pager: MessagesPager) => Promise<RestyResponse<IMessage[]>>;
  postMessage: (channelID: string, message: MessageToCreate) => Promise<RestyResponse<IMessage>>;
  deleteMessage: (channelID: string, messageID: string, hideTip?: boolean) => Promise<RestyResponse<any>>;
}

// MessageAttachment 附件定义
export interface MessageAttachment {
  url: string;
}

export interface EmbedThumbnail {
  url: string;
}
// EmbedField Embed字段描述

export interface EmbedField {
  name: string; // 字段名
}
export interface Embed {
  title: string;
  description?: string;
  prompt?: string;
  thumbnail?: EmbedThumbnail;
  fields?: EmbedField[];
}

// Ark 消息模版
export interface Ark {
  template_id: string; // ark 模版 ID
  kv: ArkKV[];
}

// ArkKV Ark 键值对
export interface ArkKV {
  key: string;
  value: string;
  obj?: ArkObj[];
}

// ArkObj Ark 对象
export interface ArkObj {
  obj_kv: ArkObjKV[];
}

// ArkObjKV Ark 对象键值对
export interface ArkObjKV {
  key: string;
  value: string;
}

// 消息对象(Message)
export interface IMessage {
  id: string; // 消息ID
  channel_id: string; // 子频道ID
  guild_id: string; // 频道ID
  content: string; // 内容
  timestamp: string; // 发送时间
  edited_timestamp: string; // 消息编辑时间
  mention_everyone: boolean; // 是否@all
  author: IUser;
  member: IMember; // 消息发送方Author的member属性，只是部分属性
  attachments: MessageAttachment[]; // 附件
  embeds: Embed[]; // 结构化消息-embeds
  mentions: IUser[]; // 消息中的提醒信息(@)列表
  ark: Ark; // ark 消息
  seq?: number; // 用于消息间的排序
  seq_in_channel?: string; // 子频道消息 seq
}

// 接口返回的数据多一层message
export interface IMessageRes {
  message: IMessage;
}

// MessagesPager 消息分页
export interface MessagesPager {
  // around: 读此id前后的消息	before:读此id之前的消息 after:读此id之后的消息
  type: 'around' | 'before' | 'after'; // 拉取类型
  id: string; // 消息ID
  limit: string; // 最大20
}

export interface MessageReference {
  message_id: string; // 需要引用回复的消息 ID
  ignore_get_message_error?: boolean; // 是否忽略获取引用消息详情错误，默认否（如不忽略，当获取引用消息详情出错时，消息将不会发出）
}

// 消息体结构
export interface MessageToCreate {
  content?: string;
  embed?: Embed;
  ark?: Ark;
  message_reference?: MessageReference;
  image?: string;
  msg_id?: string; // 要回复的消息id,不为空则认为是被动消息,公域机器人会异步审核，不为空是被动消息，公域机器人会校验语料
  keyboard?: MessageKeyboard;
  markdown?: MessageMarkdown;
}

export interface MessageMarkdown {
  template_id?: number; // 【已废弃】平台 Markdown 模板 ID。使用模板时填写，非模板不传（旧用于订阅消息）
  custom_template_id?: string;
  content?: string;
  params?: MessageMarkdownParam[];
  force_verify_image_resource?: boolean; // 是否校验图片转存结果，当为true时，如果出现图片转存失败，则会返回错误，消息不会发送。默认为false
}

export interface MessageMarkdownParam {
  key: string;
  values: string[];
}

// MessageKeyboard 消息按钮组件
export interface MessageKeyboard {
  id?: string;
  content?: CustomKeyboard;
}

// CustomKeyboard 自定义 Keyboard
export interface CustomKeyboard {
  rows?: Row[];
}

// Row 每行结构
export interface Row {
  buttons?: Button[];
}

// Button 单个按纽
export interface Button {
  id?: string; // 按钮 ID
  render_data?: RenderData; // 渲染展示字段
  action?: Action; // 该按纽操作相关字段
}

// RenderData  按纽渲染展示
export interface RenderData {
  label?: string; // 按钮文字，最多 10 字符
  visited_label?: string; // 点击后文字，不传则保持不变
  style?: number; // 按钮样式，0=灰线框, 1=蓝线框, 2=白字, 3=蓝底白字
}

// Action 按纽点击操作
export interface Action {
  type?: number; // 操作类型；0=跳转按钮（http 或 小程序）, 1=回调按钮（回调后台接口, data 传给后台）, 2=指令按钮（自动在输入框插入 @bot data）, 3=客户端native跳转链接（mqqapi，有白名单）, 4=订阅按钮
  permission?: Permission; // 可操作
  click_limit?: number; // 可点击的次数, 默认不限
  data?: string; // 操作相关数据，type=1/2 时必填
  at_bot_show_channel_list?: boolean; // false:当前 true:弹出展示子频道选择器
  unsupport_tips?: string; // 版本过低时提示文案
  enter?: boolean; // 指令按钮可用，点击按钮后直接自动发送 data，仅单聊可用，默认 false。支持版本 8983
  reply?: boolean; // 指令按钮可用，指令是否带引用回复本消息，默认 false。支持版本 8983
  anchor?: number; // 本字段仅在指令按钮下有效，设置后后会忽略 action.enter 配置。 设置为 1 时 ，点击按钮自动唤起启手Q选图器，其他值暂无效果。 （仅支持手机端版本 8983+ 的单聊场景，桌面端不支持）
  subscribe_data?: ISubscribeData; // 订阅按钮数据
  modal?: IModal; // 用户点击二次确认操作
}

// Permission 按纽操作权限
export interface Permission {
  type?: number; // PermissionType 按钮的权限类型
  specify_role_ids?: string[]; // SpecifyRoleIDs 身份组
  specify_user_ids?: string[]; // SpecifyUserIDs 指定 UserID
}

// 订阅按钮数据
export interface ISubscribeData {
  template_ids: ITemplateId[]; // 具体要订阅的模板列表，最多 3 项
}

export interface ITemplateId {
  template_id?: number; // 平台 Markdown 模板 ID（由运营设置，有bot白名单），与 custom_template_id 互斥
  custom_template_id?: string; // 自定义 Markdown 模板 ID，与 template_id 互斥
}

// Modal 二次确认数据
export interface IModal {
  content?: string; // 二次确认的提示文本,如果不为空则会进行二次确认. 注意:最多40个字符, 不能有URL
  confirm_text?: string; // 二次确认提示确认按钮中展示的文字,可以为空,  默认为"确认" 注意:最多4个字符
  cancel_text?: string; // 二次确认提示取消按钮中的文字,可以为空,默认为"取消" 注意:最多4个字符
}
