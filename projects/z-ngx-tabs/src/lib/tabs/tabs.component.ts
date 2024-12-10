import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {SimpleReuseStrategy} from '../service/route-reuse-strategy';
import {ITabType} from '../option/tab-type';

@Component({
  selector: 'lib-tabs',
  imports: [
    RouterOutlet
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements OnInit {
  //菜单数据
  @Input() datasource: ITabType[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.activeTabAndPage(this.datasource.find(item => item.active)?.id || '');
  }

  clickTab(event: Event, id: string) {
    let target = event.target;
    if (target) {
      let nowElement = target as HTMLElement;
      //如果点击的是关闭按钮
      if (nowElement && nowElement.closest(".tab-close-btn")) {
        this.closeTabAndPage([id]);
        //切换按钮
      } else {
        this.activeTabAndPage(id);
      }
    }
  }

  canGotoTabPage = true;

  activeTabAndPage(id: string) {
    if (id) {

      let tab: ITabType | undefined;
      this.datasource.forEach(item => {
        if (item.id === id) {
          item.active = true;
          tab = item;
        } else {
          item.active = false;
        }
      });

      if (this.canGotoTabPage && tab) {
        let path = tab.path;
        this.canGotoTabPage = false;
        this.router?.navigate([path, (tab.ignoreStrong ? {zActiveTabId: id} : {zActiveAndStrongTabId: id})], {relativeTo: this.activatedRoute});
        setTimeout(() => {
          this.canGotoTabPage = true;
        }, 200)
      }
    }
  }


  //当前右键点击的tabId
  waitCloseId = "";
  closePanel: HTMLElement | undefined;

  closeTabAndPage(ids: string[]) {
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      let index = this.datasource.findIndex(item => item.id === id);
      if (index >= 0) {
        this.datasource.splice(index, 1);
        SimpleReuseStrategy.deleteRouteSnapshot(id);
      }
    }
    //如果还有剩余tab并且剩余tab中没有被激活的tab,则默认激活第一个
    let len = this.datasource.length;
    if (len > 0 && !this.datasource.find(tab => tab.active)) {
      this.activeTabAndPage(this.datasource[len - 1].id);
    }
  }

  rightPanel(event: MouseEvent) {
    event.preventDefault();
    let target = event.target;
    if (target) {
      let nowElement = target as HTMLElement;
      let nowId: string = "";
      if (nowElement.classList.contains("tab")) {
        nowId = nowElement.dataset["id"] as string;
      } else if (nowElement.closest(".tab")) {
        nowId = ((nowElement.closest(".tab") as HTMLElement)?.dataset["id"] || '') as string;
      }
      if (nowId) {
        this.waitCloseId = nowId;
        //判断当前的浏览器对象上是否有右键关闭面板
        this.closePanel = (window.top as any)["z_auto_right_panel_0726"];
        let [x, y] = [event.clientX, event.clientY];
        if (!this.closePanel) {
          this.closePanel = window.document.createElement("div");
          this.closePanel.setAttribute("id", "z_auto_right_panel_0726");
          this.closePanel.setAttribute("style", `z-index: 9999999; width: 105px; height: 83px; position: absolute; background-color: rgb(255, 255, 255); border: 1px solid rgb(229 171 171); box-shadow: rgba(0,0,0,0.35) 1px 1px 4px 0px;`);
          this.closePanel.innerHTML = `
          <style>
            #z_auto_right_panel_0726 ul li[data-cmd]{display: flex; align-items: center; justify-content: space-around; padding: 2px 6px 2px 8px;;cursor: pointer;}
            #z_auto_right_panel_0726 ul li[data-cmd] .icon{width: 18px;}
            #z_auto_right_panel_0726 ul li[data-cmd]:hover{background-color: #00BCD4; color: #fff;fill: rgb(234,223,223)}
          </style>
          <ul style="padding: 4px 0;font-size: 14px;margin: 0">
              <li data-cmd="closeAll"><svg class="icon" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M512 64a448 448 0 1 0 448 448A448 448 0 0 0 512 64z m0 832a384 384 0 1 1 384-384 384 384 0 0 1-384 384zM448 480h-82.88l41.6-41.28a32 32 0 0 0-45.44-45.44l-96 96a32 32 0 0 0 0 45.44l96 96a32 32 0 0 0 45.44 0 32 32 0 0 0 0-45.44L365.12 544H448a32 32 0 0 0 0-64zM662.72 393.28a32 32 0 0 0-45.44 45.44l41.6 41.28H576a32 32 0 0 0 0 64h82.88l-41.6 41.28a32 32 0 0 0 0 45.44 32 32 0 0 0 45.44 0l96-96a32 32 0 0 0 0-45.44z" /></svg> 全部关闭</span></li>
              <li style="height: 1px; margin: 4px 0; overflow: hidden; background-color: #e5e5e5;"></li>
              <li data-cmd="closeLeft"><svg class="icon" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M512 64a448 448 0 1 0 448 448A448 448 0 0 0 512 64z m0 832a384 384 0 1 1 384-384 384 384 0 0 1-384 384zM608 480h-242.88l41.6-41.28a32 32 0 0 0-45.44-45.44l-96 96a32 32 0 0 0 0 45.44l96 96a32 32 0 0 0 45.44 0 32 32 0 0 0 0-45.44L365.12 544H608a32 32 0 0 0 0-64zM736 384a32 32 0 0 0-32 32v192a32 32 0 0 0 64 0v-192a32 32 0 0 0-32-32z" /></svg> 关闭左侧</span></li>
              <li data-cmd="closeRight"><svg class="icon" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M512 64a448 448 0 1 0 448 448A448 448 0 0 0 512 64z m0 832a384 384 0 1 1 384-384 384 384 0 0 1-384 384zM534.72 393.28a32 32 0 0 0-45.44 45.44l41.6 41.28H288a32 32 0 0 0 0 64h242.88l-41.6 41.28a32 32 0 0 0 0 45.44 32 32 0 0 0 45.44 0l96-96a32 32 0 0 0 0-45.44zM736 384a32 32 0 0 0-32 32v192a32 32 0 0 0 64 0v-192a32 32 0 0 0-32-32z" /></svg> 关闭右侧</span></li>
          </ul>
          `;
          this.closePanel.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (target.tagName !== "LI") {
              target = target.closest("li") as HTMLElement;
            }
            if (target && target.getAttribute("data-cmd")) {
              let cmd = target.dataset["cmd"];
              let waitIds: string[] = [];
              switch (cmd) {
                //关闭全部
                case "closeAll":
                  waitIds = this.datasource.reduce((pre, cur) => {
                    if (cur.canClose) {
                      pre.push(cur.id);
                    }
                    return pre;
                  }, new Array<string>());
                  break;
                //关闭左侧
                case "closeLeft":
                  for (let i = 0; i < this.datasource.length; i++) {
                    let tab = this.datasource[i];
                    if (tab.canClose && tab.id !== this.waitCloseId) {
                      waitIds.push(tab.id);
                    } else if (tab.id === this.waitCloseId) {
                      break;
                    }
                  }
                  break;
                //关闭右侧
                case "closeRight":
                  for (let i = this.datasource.length - 1; i >= 0; i--) {
                    let tab = this.datasource[i];
                    if (tab.canClose && tab.id !== this.waitCloseId) {
                      waitIds.push(tab.id);
                    } else if (tab.id === this.waitCloseId) {
                      break;
                    }
                  }
                  break;
              }
              this.closeTabAndPage(waitIds);
              this.closePanel?.remove();
            }
          });
          window.document.body.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (target.id !== "z_auto_right_panel_0726" && !target.closest("#z_auto_right_panel_0726")) {
              this.closePanel?.remove();
            }
          });
          (window.top as any).z_auto_right_panel_0726 = this.closePanel;
        }
        this.closePanel.style.left = x + "px";
        this.closePanel.style.top = y + "px";
        window.document.body.append(this.closePanel);
      }
    }
  }

}


/*


import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AccordionModule, LayoutModule, SplitterModule, SplitterOrientation, TabsModule, TooltipModule} from "ng-devui";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  ActivatedRoute,
  Router,
  RouterOutlet
} from "@angular/router";
import {SimpleReuseStrategy} from "../../services/route-reuse-strategy";

export interface IMenuType {
  id: string;           //菜单id用来跟tab的id一一对应
  title: string;        //菜单名称
  active?: boolean;      //此菜单激活状态
  children?: Array<IMenuType>;  //菜单子项
  icon?: string;                //菜单的图标
  path?: string;                //此菜单对应的页面地址
  home?: boolean               //此菜单是默认首页吗？
}

export interface ITabType {
  id: string,
  title: string,
  canClose: boolean
}

export interface IPageType {
  id: string,
  path: string,
  show: boolean,
}

@Component({
  standalone: true,
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  imports: [
    SplitterModule,
    AccordionModule,
    NgIf,
    TooltipModule,
    NgClass,
    NgForOf,
    TabsModule,
    LayoutModule,
    RouterOutlet
  ],
  styleUrls: ['./menu-content.component.scss']
})
export class MenuContentComponent implements OnInit {
  //菜单数据
  @Input() datasource: IMenuType[] = [];
  menusItems: IMenuType[] = [];
  //允许关闭数据
  allowCloseTabs: string[] = [];


  // splitter input
  orientation: SplitterOrientation = 'horizontal';
  splitBarSize = '2px';

  // splitter pane input
  size = '14%';
  minSize = '5%';
  maxSize = '60%';
  @Input() collapsed = false;
  isPaneShrink = false;
  hoverCard: Array<any> = [];

  //tabs
  normalTabActiveId: string | number = 'welcome1';
  defaultPage = "welcome";
  tabItems: Array<ITabType> = [];
  closeable = true;

  //contentPages
  contentPages: Array<IPageType> = [];

  //路由列表
  constructor(private cd: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute) {
    //路由事件监听
    /!*this.router.events
      .subscribe((event: any) => {
         //路由开始
         if (event instanceof NavigationStart) {
           console.log("开始路由")
         }
         //路由惰性加载某个路由配置之前触发
         if (event instanceof RouteConfigLoadStart) {
           console.log("惰性加载前")
         }
         //路由惰性加载某个路由配置之后触发
         if (event instanceof RouteConfigLoadEnd) {
           console.log("惰性加载后")
         }
         //解析URL，并识别出路由时触发
         if (event instanceof RoutesRecognized) {
           console.log("解析URL,识别路由")
         }
         //开始执行路由守卫
         if (event instanceof GuardsCheckStart) {
           console.log("开始执行路由守卫")
         }
         //开始激活某个路由的子路由
         if (event instanceof ChildActivationStart) {
           console.log("开始激活某个路由的子路由")
         }
         //开始激活某个路由
         if (event instanceof ActivationStart) {
           console.log("开始激活某个路由")
         }
         //完成路由守卫阶段
         if (event instanceof GuardsCheckEnd) {
           console.log("完成路由守卫阶段")
         }
         //开始路由解析阶段
         if (event instanceof ResolveStart) {
           console.log("开始路由解析阶段")
         }
         //完成路由解析阶段
         if (event instanceof ResolveEnd) {
           console.log("完成路由解析阶段")
         }
         //激活完成某个路由的子路由
         if (event instanceof ChildActivationEnd) {
           console.log("激活完成某个路由的子路由")
         }
         //激活完成某个路由
         if (event instanceof ActivationEnd) {
           console.log("激活完成某个路由")
         }
         //结束路由
         if (event instanceof NavigationEnd) {
           console.log("结束路由")
         }
         //取消路由
         if (event instanceof NavigationCancel) {
           console.log("路由取消")
         }
         //路由报错
         if (event instanceof NavigationError) {
           console.log("路由报错")
         }
        let shot:any = event.snapshot;
         if(shot && shot['_routerState']){
           let url = shot['_routerState'].url;
           console.log(url);
           console.log(event);
         }

      });*!/
  }

  ngOnInit() {
    //强迫式变更检测
    this.cd.detectChanges();
    this.initMenu();

    if (this.datasource.length == 1 && this.datasource[0].home) {
      this.closeable = false;
    }

    // this.goToTabPage();
  }


  initMenu() {
    this.datasource.forEach((menu) => {
      if (menu.home) {
        this.tabItems.push({
          id: menu.id,
          title: menu.title,
          canClose: false
        });
        if (this.contentPages.length <= 0) {
          this.contentPages.push({
            id: menu.id,
            path: menu.path || '404',
            show: true
          });
          this.normalTabActiveId = menu.id;
        }
      } else {
        //宽版菜单
        this.menusItems.push(menu);
        //窄版菜单
        this.hoverCard.push(menu.title);
      }
    });
    //允许关闭的tab
    this.allowCloseTabs = this.allNotHomeMenus(this.datasource);


  }

  allNotHomeMenus(menus: IMenuType[]) {
    return menus.reduce((pre, cur) => {
      if (!cur.home) {
        pre.push(cur.id);
      }
      if (cur.children) {
        pre.push(...this.allNotHomeMenus(cur.children));
      }
      return pre;
    }, new Array<string>());
  }


  collapsedChange(event: boolean) {
    this.collapsed = event;
  }

  selectItem(selectedItem: IMenuType | undefined) {
    this.activeItem(selectedItem, this.menusItems);
    this.collapsedChange(false);
  }

  activeItem(selectedItem: IMenuType | undefined, menus: IMenuType[]) {
    menus.forEach((item) => {
      if (item === selectedItem) {
        item.active = true;
      } else {
        item.active = false;
        if (item.children) {
          this.activeItem(selectedItem, item.children);
        }
      }
    });
  }

  paneShrinkStatus(status: boolean) {
    this.isPaneShrink = status;
  }

  hasActive(item: IMenuType): boolean {
    if (item.active) {
      return true;
    } else if (item.children) {
      for (let i = 0; i < item.children.length; i++) {
        if (this.hasActive(item.children[i])) {
          return true;
        }
      }
    }
    return false;
  }

  getMenuById(id: string, menus: IMenuType[]): any {
    for (let i = 0; i < menus.length; i++) {
      const item = menus[i];
      if (item.id == id) {
        return item;
      } else if (item.children) {
        let menu = this.getMenuById(id, item.children);
        if (menu) {
          return menu;
        }
      }
    }
  }

  //打开标签页
  openTab(event: any) {
    const id = event.item?.id || event;
    const hasTabItem = this.tabItems.find((item) => item.id == id);
    let menuItem: IMenuType | undefined = this.getMenuById(id, this.datasource);
    if (!hasTabItem && menuItem) {
      this.tabItems.push({
        id: menuItem.id,
        title: menuItem.title,
        canClose: !menuItem.home
      });
    }
    this.normalTabActiveId = id;
    let findPage = false;
    this.contentPages.forEach(page => {
      page.show = page.id == id;
      if (page.show) {
        findPage = true;
      }
    });
    if (!findPage && menuItem) {
      this.contentPages.push({
        id: menuItem.id,
        path: menuItem.path || this.defaultPage,
        show: true
      });
    }

    this.goToTabPage();
  }

  closeTabAndPage(ids: string[]) {
    this.tabItems = this.tabItems.filter((item) => !ids.includes(item.id));
    let delPageId: Array<string> = [];
    this.contentPages = this.contentPages.filter(page => {
      if (ids.includes(page.id)) {
        delPageId.push(page.id);
        return false;
      } else {
        return true;
      }
    });
    //删除复用
    if (delPageId && delPageId.length > 0) {
      for (const did of delPageId) {
        SimpleReuseStrategy.deleteRouteSnapshot(did);
      }
    }

    if (this.tabItems.length > 0 && !this.tabItems.find(tab => tab.id === this.normalTabActiveId)) {
      let waitTab = this.tabItems.find(tab => tab.id === this.waitCloseId);
      if (waitTab) {
        let id = waitTab.id;
        this.normalTabActiveId = id;
        let waitPage = this.contentPages.find(page => page.id === id);
        if (waitPage) {
          waitPage.show = true;
        }
      }else {
        this.normalTabActiveId = this.tabItems[0]?.id;
        this.contentPages[0].show = true;
      }
      this.selectItem(this.menusItems.find(item => item.id === this.normalTabActiveId));
    }
    this.goToTabPage();
  }


  deleteTab(event: any) {
    const id: string = event.id;
    const operation = event.operation;
    if (operation === 'delete' && this.tabItems?.length >= 1) {
      this.closeTabAndPage([id]);
    }
  }

  yh = 1;

  //跳转至标签页
  goToTabPage() {
    if (this.yh) {
      this.yh = 0;

      let activePage = this.contentPages.find(page => page.show);
      if (activePage && activePage.id) {
        let url = activePage.path;

        let xu = "";
        let xHandlerValue: any;
        let yyu: Array<string> = [];
        SimpleReuseStrategy.handlers.forEach((value, key) => {
          let ap = activePage;
          if (ap && !value[1].endsWith(ap.id) && value[1].includes(ap.id)) {
            if (!yyu.includes(value[1])) {
              xu = value[1];
              yyu.push(xu);
              xHandlerValue = value[0];
            }
          }
        });

        let mr = true;
        if (xu) {
          if (xHandlerValue && xHandlerValue.route && xHandlerValue.route.value) {
            const xActiveRoute = xHandlerValue.route.value;
            if (xActiveRoute instanceof ActivatedRoute) {
              xu = xu.replace(/_/g, '/');
              if (xu) {
                mr = false;
                this.router?.navigateByUrl(xu);

              }
            }

          }
        }
        if (mr) {
          this.router?.navigate([url, {menuPageId: activePage.id}], {relativeTo: this.activatedRoute});
        }
      }

      setTimeout(() => {
        this.yh = 1;
      }, 200)
    }
  }

  //当前右键点击的tabId
  waitCloseId = "";
  closePanel: HTMLElement | undefined;

  rightPanel(event: MouseEvent) {
    event.preventDefault();
    let target = event.target;
    if (target) {
      let nowElement = target as HTMLElement;
      let nowId: string;
      if (nowElement.classList.contains("devui-nav-tab-item")) {
        nowId = nowElement.id;
      } else {
        nowId = (nowElement.closest(".devui-nav-tab-item")?.id || '') as string;
      }
      if (nowId) {
        this.waitCloseId = nowId;
        //判断当前的浏览器对象上是否有右键关闭面板
        this.closePanel = (window.top as any)["z_auto_right_panel_0726"];
        let [x, y] = [event.clientX, event.clientY];
        if (!this.closePanel) {
          this.closePanel = window.document.createElement("div");
          this.closePanel.setAttribute("id", "z_auto_right_panel_0726");
          this.closePanel.setAttribute("style", `z-index: 9999999; width: 105px; height: 85px; position: absolute; background-color: rgb(255, 255, 255); border: 1px solid rgb(229 171 171); box-shadow: rgba(0,0,0,0.35) 1px 1px 4px 0px;`);
          this.closePanel.innerHTML = `
          <style>
            #z_auto_right_panel_0726 ul li[data-cmd]{display: flex; align-items: center; justify-content: space-around; padding: 0 6px 0 4px;;cursor: pointer;}
            #z_auto_right_panel_0726 ul li[data-cmd] .material-symbols-outlined{font-size: 22px;;}
            #z_auto_right_panel_0726 ul li[data-cmd]:hover{background-color: #00BCD4; color: #fff;}
          </style>
          <ul style="padding: 4px 0;font-size: 14px;">
              <li data-cmd="closeAll"><span class="material-symbols-outlined">cancel_presentation</span> 全部关闭</span></li>
              <li style="height: 1px; margin: 4px 0; overflow: hidden; background-color: #e5e5e5;"></li>
              <li data-cmd="closeLeft"><span class="material-symbols-outlined">arrow_menu_close</span> 关闭左侧</span></li>
              <li data-cmd="closeRight"><span class="material-symbols-outlined">arrow_menu_open</span> 关闭右侧</span></li>
          </ul>
          `;
          this.closePanel.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (target.tagName !== "LI") {
              target = target.closest("li") as HTMLElement;
            }
            if (target && target.getAttribute("data-cmd")) {
              let cmd = target.dataset["cmd"];
              let waitIds: string[] = [];
              switch (cmd) {
                //关闭全部
                case "closeAll":
                  waitIds = this.tabItems.reduce((pre, cur) => {
                    if (cur.canClose) {
                      pre.push(cur.id);
                    }
                    return pre;
                  }, new Array<string>());
                  break;
                //关闭左侧
                case "closeLeft":
                  for (let i = 0; i < this.tabItems.length; i++) {
                    let tab = this.tabItems[i];
                    if (tab.canClose && tab.id !== this.waitCloseId) {
                      waitIds.push(tab.id);
                    } else if (tab.id === this.waitCloseId) {
                      break;
                    }
                  }
                  break;
                //关闭右侧
                case "closeRight":
                  for (let i = this.tabItems.length - 1; i >= 0; i--) {
                    let tab = this.tabItems[i];
                    if (tab.canClose && tab.id !== this.waitCloseId) {
                      waitIds.push(tab.id);
                    } else if (tab.id === this.waitCloseId) {
                      break;
                    }
                  }
                  break;
              }
              this.closeTabAndPage(waitIds);
              this.closePanel?.remove();
            }
          });
          window.document.body.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (target.id !== "z_auto_right_panel_0726" && !target.closest("#z_auto_right_panel_0726")) {
              this.closePanel?.remove();
            }
          });
          (window.top as any).z_auto_right_panel_0726 = this.closePanel;
        }
        this.closePanel.style.left = x + "px";
        this.closePanel.style.top = y + "px";
        window.document.body.append(this.closePanel);
      }
    }
  }
}
*/
