import {
  Config,
  OpenAPIRequest,
  IUser,
  MeAPI,
  IGuild,
  MeGuildsReq,
  IMenuResponse,
  MenuToCreate,
  MenuUpdateResponse,
  PanelListPager,
  IPanelListResponse,
  PanelToCreate,
  PanelCreateResponse,
  IPanelDetail,
  PanelToUpdate,
  PanelUpdateResponse,
  PanelTargetToUpdate,
} from '@src/types';
import { RestyResponse } from 'resty-client';
import { getURL } from './resource';

export default class Me implements MeAPI {
  public request: OpenAPIRequest;
  public config: Config;
  constructor(request: OpenAPIRequest, config: Config) {
    this.request = request;
    this.config = config;
  }

  // 获取当前用户信息
  public me(): Promise<RestyResponse<IUser>> {
    const options = {
      method: 'GET' as const,
      url: getURL('userMeURI'),
    };
    return this.request<IUser>(options);
  }

  // 获取当前用户频道列表
  public meGuilds(options?: MeGuildsReq): Promise<RestyResponse<IGuild[]>> {
    const reqOptions = {
      method: 'GET' as const,
      url: getURL('userMeGuildsURI'),
      params: options,
    };
    return this.request<IGuild[]>(reqOptions);
  }

  /**
   * 生成分享链接
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_generate_url_link.post.html
   */
  public generateUrlLink(callback_data?: string): Promise<RestyResponse<{ url_link: string }>> {
    const options = {
      method: 'POST' as const,
      url: getURL('generateUrlLinkURI'),
      data: {
        callback_data,
      },
    };
    return this.request<{ url_link: string }>(options);
  }

  /**
   * 查询全局自定义菜单
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_menu.get.html
   */
  public getMenu(): Promise<RestyResponse<IMenuResponse>> {
    const options = {
      method: 'GET' as const,
      url: getURL('menuURI'),
    };
    return this.request<IMenuResponse>(options);
  }

  /**
   * 修改全局自定义菜单
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_menu.put.html
   */
  public updateMenu(payload: MenuToCreate): Promise<RestyResponse<MenuUpdateResponse>> {
    const options = {
      method: 'PUT' as const,
      url: getURL('menuURI'),
      data: payload,
    };
    return this.request<MenuUpdateResponse>(options);
  }

  /**
   * 查询指令面板列表
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels.get.html
   */
  public getPanels(pager: PanelListPager): Promise<RestyResponse<IPanelListResponse>> {
    const options = {
      method: 'GET' as const,
      url: getURL('panelsURI'),
      params: pager,
    };
    return this.request<IPanelListResponse>(options);
  }

  /**
   * 创建指令面板
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels.post.html
   */
  public createPanel(payload: PanelToCreate): Promise<RestyResponse<PanelCreateResponse>> {
    const options = {
      method: 'POST' as const,
      url: getURL('panelsURI'),
      data: payload,
    };
    return this.request<PanelCreateResponse>(options);
  }

  /**
   * 查询指令面板详情
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels_panel_id.get.html
   */
  public getPanel(panelID: string): Promise<RestyResponse<IPanelDetail>> {
    const options = {
      method: 'GET' as const,
      url: getURL('panelURI'),
      rest: {
        panelID,
      },
    };
    return this.request<IPanelDetail>(options);
  }

  /**
   * 修改指令面板
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels_panel_id.put.html
   */
  public updatePanel(panelID: string, payload: PanelToUpdate): Promise<RestyResponse<PanelUpdateResponse>> {
    const options = {
      method: 'PUT' as const,
      url: getURL('panelURI'),
      rest: {
        panelID,
      },
      data: payload,
    };
    return this.request<PanelUpdateResponse>(options);
  }

  /**
   * 删除指令面板
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels_panel_id.delete.html
   */
  public deletePanel(panelID: string): Promise<RestyResponse<any>> {
    const options = {
      method: 'DELETE' as const,
      url: getURL('panelURI'),
      rest: {
        panelID,
      },
    };
    return this.request(options);
  }

  /**
   * 修改指令面板关联对象
   * @link https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_panels_panel_id_target.put.html
   */
  public updatePanelTarget(panelID: string, payload: PanelTargetToUpdate): Promise<RestyResponse<any>> {
    const options = {
      method: 'PUT' as const,
      url: getURL('panelTargetURI'),
      rest: {
        panelID,
      },
      data: payload,
    };
    return this.request(options);
  }
}
