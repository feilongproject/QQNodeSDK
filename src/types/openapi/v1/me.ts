import { RestyResponse } from 'resty-client';
import { IGuild } from './guild';

/**
 * =============  User 用户接口  =============
 */
export interface MeAPI {
  me: () => Promise<RestyResponse<IUser>>;
  meGuilds: (options?: MeGuildsReq) => Promise<RestyResponse<IGuild[]>>;
  generateUrlLink: (callback_data?: string) => Promise<RestyResponse<{ url_link: string }>>;
  // 全局自定义菜单
  getMenu: () => Promise<RestyResponse<IMenuResponse>>;
  updateMenu: (payload: MenuToCreate) => Promise<RestyResponse<MenuUpdateResponse>>;
  // 指令面板
  getPanels: (pager: PanelListPager) => Promise<RestyResponse<IPanelListResponse>>;
  createPanel: (payload: PanelToCreate) => Promise<RestyResponse<PanelCreateResponse>>;
  getPanel: (panelID: string) => Promise<RestyResponse<IPanelDetail>>;
  updatePanel: (panelID: string, payload: PanelToUpdate) => Promise<RestyResponse<PanelUpdateResponse>>;
  deletePanel: (panelID: string) => Promise<RestyResponse<any>>;
  updatePanelTarget: (panelID: string, payload: PanelTargetToUpdate) => Promise<RestyResponse<any>>;
}
export interface IUser {
  id: string;
  username: string;
  avatar: string;
  bot: boolean;
  union_openid: string; // 特殊关联应用的 openid
  union_user_account: string; // 机器人关联的用户信息，与union_openid关联的应用是同一个
}

export interface MeGuildsReq {
  before?: string; // 读此id之前的数据
  after?: string; // 读此id之后的数据
  limit?: number; // 每次拉取多少条数据 最大不超过 100
}

/**
 * ============= 全局自定义菜单 =============
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/menu-panel/
 */

/**
 * 查询全局自定义菜单响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_menu.get.html
 */
export interface IMenuResponse {
  version: number; // 当前菜单的版本号
  menu?: IMenu; // 当前生效的菜单配置。未设置过菜单时该字段为空
}

/**
 * 修改全局自定义菜单请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_menu.put.html
 */
export interface MenuToCreate {
  menu?: IMenu; // 菜单配置。传入后会覆盖原有的完整菜单配置
}

/**
 * 修改全局自定义菜单响应
 */
export interface MenuUpdateResponse {
  version: number; // 本次修改后的菜单版本号，可用于后续判断配置是否有变更
}

/**
 * 菜单配置
 */
export interface IMenu {
  items: IMenuItem[]; // 菜单项列表，最多 10 个，按列表顺序从左到右展示
}

/**
 * 一级菜单项
 */
export interface IMenuItem {
  name: string; // 按钮名称，最多 10 个字符，一个中文汉字算2个字符
  type: 'switch' | 'send_message' | 'link' | 'menu'; // 按钮类型: switch=开关, send_message=发送消息, link=链接跳转, menu=含子菜单的折叠项
  sub_menu_items?: ISubMenuItem[]; // 子菜单列表，仅 type=menu 时有效。子菜单最多 5 个，不支持再嵌套
  send_message?: string; // 发送的内容，仅 type=send_message 时有效。用户点击后该文本会自动填入聊天输入框
  link?: string; // 跳转链接 URL，仅 type=link 时有效。链接必须以 https:// 开头
  switch?: IMenuSwitch; // 开关配置，仅 type=switch 时有效
}

/**
 * 二级菜单项
 */
export interface ISubMenuItem {
  name: string; // 按钮名称，最多 14 个字符，约7个中文汉字
  type: 'send_message' | 'link'; // 按钮类型。二级菜单不支持 menu 类型
  send_message?: string; // 发送的内容，仅 type=send_message 时有效
  link?: string; // 跳转链接 URL，仅 type=link 时有效。链接必须以 https:// 开头
}

/**
 * 开关配置
 */
export interface IMenuSwitch {
  switch_id: string; // 开关唯一标识。用户切换开关状态后会发送一条消息，消息内容中会携带此字段
  default: boolean; // 开关的初始状态。true=默认打开，false=默认关闭
}

/**
 * ============= 指令面板 =============
 * @link https://bot.q.qq.com/wiki/develop/api-v2/server-inter/menu-panel/
 */

/**
 * 查询指令面板列表分页参数
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels.get.html
 */
export interface PanelListPager {
  scope: 'c2c' | 'group' | 'channel' | 'dm'; // 生效场景（必填）: c2c=单聊, group=群聊, channel=文字子频道, dm=频道私信
  cursor?: string; // 分页游标。首次请求不传或传空串，后续请求传入上次响应中的 next_cursor 值
  limit?: number; // 每页拉取条数，默认 20，最大 50
}

/**
 * 查询指令面板列表响应
 */
export interface IPanelListResponse {
  records: IPanelRecord[]; // 面板记录列表，按设置时间倒序排列
  next_cursor: string; // 下一页游标。空串表示已到最后一页
  is_end: boolean; // 是否已拉取到最后一页。true 表示无更多数据
}

/**
 * 面板记录
 */
export interface IPanelRecord {
  panel_id: string; // 面板 ID
  scope: 'c2c' | 'group' | 'channel' | 'dm'; // 生效场景
  target_type: 'all' | 'specific'; // 作用范围: all=全局配置, specific=指定用户/群生效。仅 c2c/group 场景可能为 specific
  panel: IPanel; // 面板配置内容
  created_at: string; // 面板创建时间（RFC3339 格式）
  updated_at: string; // 面板更新时间（RFC3339 格式）
  version: number; // 面板版本号
}

/**
 * 查询指令面板详情响应
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels_panel_id.get.html
 */
export interface IPanelDetail {
  panel_id: string; // 面板 ID
  scope: 'c2c' | 'group' | 'channel' | 'dm'; // 生效场景
  target_type: 'all' | 'specific'; // 作用范围
  panel: IPanel; // 面板配置内容
  created_at: string; // 面板创建时间（RFC3339 格式）
  updated_at: string; // 面板更新时间（RFC3339 格式）
  version: number; // 面板版本号
  user_openids?: string[]; // 关联的用户 openid 列表。仅 c2c 场景且 target_type=specific 时返回，最多 1000 条
  group_openids?: string[]; // 关联的群 openid 列表。仅 group 场景且 target_type=specific 时返回，最多 1000 条
}

/**
 * 面板配置内容
 */
export interface IPanel {
  items: IPanelItem[]; // 面板元素列表，一个指令面板里最多配置 20 个
  remark?: string; // 面板备注，最多 255 个字符，不对用户展示
  version?: number; // 当前版本号
}

/**
 * 面板元素
 */
export interface IPanelItem {
  name: string; // 元素名称。type=command 时用户点击后该内容会填入聊天输入框；type=link 时仅用于面板展示。最多 14 个字符
  desc: string; // 元素描述，最多 30 个字符
  type: 'command' | 'link'; // 元素类型: command=指令, link=链接跳转
  only_admin: boolean; // 是否仅管理员可操作。true=仅频道/群管理员可点击，false=所有用户可点击
  link?: string; // 跳转链接 URL，仅 type=link 时有效
}

/**
 * 创建指令面板请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels.post.html
 */
export interface PanelToCreate {
  scope: 'c2c' | 'group' | 'channel' | 'dm'; // 生效场景（必填）。channel 和 dm 场景仅支持全局配置（target_type 只能为 all）
  target_type?: 'all' | 'specific'; // 作用范围。仅 c2c 和 group 场景支持 specific
  user_openids?: string[]; // 用户 openid 列表，仅 c2c 场景且 target_type=specific 时有效，一次最多 20 个
  group_openids?: string[]; // 群 openid 列表，仅 group 场景且 target_type=specific 时有效，一次最多 20 个
  panel: IPanel; // 面板配置内容（必填）
}

/**
 * 创建指令面板响应
 */
export interface PanelCreateResponse {
  panel_id: string; // 新创建的面板 ID。后续修改、删除、查询详情均需使用此 ID
}

/**
 * 修改指令面板请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels_panel_id.put.html
 */
export interface PanelToUpdate {
  panel: IPanel; // 面板配置内容。传入后会覆盖原有的面板元素列表和备注，不影响已关联的用户/群列表
}

/**
 * 修改指令面板响应
 */
export interface PanelUpdateResponse {
  version: number; // 本次修改后的面板版本号
}

/**
 * 修改指令面板关联对象请求体
 * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels_panel_id_target.put.html
 */
export interface PanelTargetToUpdate {
  op: 'add' | 'del'; // 操作类型: add=添加关联对象, del=移除关联对象
  user_openids?: string[]; // 用户 openid 列表，仅 c2c 场景有效，一次最多 20 个
  group_openids?: string[]; // 群 openid 列表，仅 group 场景有效，一次最多 20 个
}
