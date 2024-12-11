import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {SimpleReuseStrategy} from '../service/route-reuse-strategy';
import {ITabType} from '../option/tab-type';

@Component({
  selector: 'z-ngx-tabs',
  imports: [
    RouterOutlet
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements OnInit, AfterViewInit, OnDestroy {
  //菜单数据
  @Input() datasource: ITabType[] = [];
  //tab激活
  @Output() activeTab = new EventEmitter();
  //tab关闭
  @Output() closeTab = new EventEmitter();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
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

        let xu = "";
        let xHandlerValue: any;
        let yyu: Array<string> = [];
        SimpleReuseStrategy.handlers.forEach((value) => {
          if (!value[1].endsWith(id) && value[1].includes(id)) {
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
          this.router?.navigate([path, (tab.ignoreStrong ? {zActiveTabId: id} : {zActiveAndStrongTabId: id})], {relativeTo: this.activatedRoute});
        }


        setTimeout(() => {
          this.canGotoTabPage = true;
        }, 200)
      }

      this.activeTab.emit(id);
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
    this.closeTab.emit(ids);
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

  //监听tabs的左右滚动按钮
  @ViewChild('tabsWrapper') tabsWrapper: ElementRef | undefined;
  @ViewChild('tabsList') tabsList: ElementRef | undefined;
  showScrollButtons = false;  // 控制是否显示滚动按钮

  private resizeObserver: ResizeObserver | undefined;

  ngAfterViewInit() {
    // 使用 ResizeObserver 来监听容器的宽度变化
    this.resizeObserver = new ResizeObserver(() => {
      this.checkIfScrollNeeded();
    });

    // 开始监听容器宽度变化
    this.resizeObserver.observe(this.tabsList?.nativeElement);

    // 初始检查
    this.checkIfScrollNeeded();
  }

  ngOnDestroy() {
    // 销毁观察器
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // 判断是否需要滚动按钮
  private checkIfScrollNeeded() {
    const wrapper = this.tabsWrapper?.nativeElement;
    const list = this.tabsList?.nativeElement;
    // 当选项卡总宽度超出容器宽度时，显示滚动按钮
    this.showScrollButtons = list.clientWidth > wrapper.clientWidth;
    this.cdr.detectChanges();
  }

  scrollLeft() {
    const tabs = this.tabsWrapper?.nativeElement;
    tabs.scrollLeft -= 100;  // 每次滚动100px
  }

  scrollRight() {
    const tabs = this.tabsWrapper?.nativeElement;
    tabs.scrollLeft += 100;  // 每次滚动100px
  }
}
