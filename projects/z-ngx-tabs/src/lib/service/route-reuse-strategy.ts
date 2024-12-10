import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

/**
 * 重写angular路由重用策略，路由重用（多标签页实现）和路由懒加载最终解决方案
 */
export class SimpleReuseStrategy implements RouteReuseStrategy {

  public static handlers: Map<string, [DetachedRouteHandle, string]> = new Map();

  private static waitDelete = new Set<string>();

  private readonly strongWild = "zActiveAndStrongTabId";

  /** 表示对所有路由允许复用，返回true，说明允许复用， 如果你有路由不想利用可以在这加一些业务逻辑判断 */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    let menuPageId = (this.getMenuPageId(route) || (route.parent == null ? "" : this.getMenuPageId(route.parent)));
    return !!menuPageId;
  }

  /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    let ru = this.getRouteUrl(route);
    if (ru && ru.includes(this.strongWild)) {
      let xru = ru;
      //如果待删除ID等于当前ID,则不缓存
      if (!(SimpleReuseStrategy.waitDelete && Array.from(SimpleReuseStrategy.waitDelete).find((wd: string) => xru.includes(wd))) && route.routeConfig) {
        let key = this.getHandlerKey(route);
        if (key) {
          if (!SimpleReuseStrategy.handlers.has(key)) {
            SimpleReuseStrategy.handlers.set(key, [handle, xru]);
          } else {
            let yh = SimpleReuseStrategy.handlers.get(key);
            if (yh) {
              SimpleReuseStrategy.handlers.delete(key);
              SimpleReuseStrategy.handlers.set(key, yh);
            }

          }
        }
      }
    }
  }

  /** 若 path 在缓存中有的都认为允许还原路由 */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    let ru = this.getRouteUrl(route);
    let key = this.getHandlerKey(route);
    if (key && ru.includes(this.strongWild) && route.routeConfig) {
      return !!SimpleReuseStrategy.handlers.get(key) && !!route.component;
    }
    return false;

  }

  /** 从缓存中获取快照，若无则返回nul */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (route.component && route.routeConfig) {
      let ru = this.getRouteUrl(route);
      let key = this.getHandlerKey(route);
      if (key && ru) {
        let handleValueArray = SimpleReuseStrategy.handlers.get(key);
        if (handleValueArray) {
          let handleValue: any = handleValueArray[0];
          if ((SimpleReuseStrategy.handlers.has(key)) && handleValue && handleValue.route && handleValue.route.value && handleValue.contexts) {
            return handleValue;
          }

        }

      }
    }
    return null;

  }

  /** 进入路由触发，判断是否同一路由 */
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig && JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  //获取是菜单页ID
  private getMenuPageId(route: ActivatedRouteSnapshot): string | null {
    return route.paramMap.get(this.strongWild)
  }

  private getHandlerKey(route: any): string | null {
    if (route.routeConfig) {
      return JSON.stringify(route.routeConfig) + JSON.stringify(route.params) + this.getRouteUrl(route);
    }
    return null;

  }

  private getRouteUrl(route: any) {
    return route['_routerState'].url.replace(/\//g, '_');
  }


  /**根据缓存key,删除快照*/
  public static deleteRouteSnapshot(id: string): void {
    SimpleReuseStrategy.handlers.forEach((value, key) => {
      let url = value[1];
      if (url && url.includes(id)) {
        SimpleReuseStrategy.handlers.delete(key);
      } else {
        SimpleReuseStrategy.waitDelete.add(id);
        setTimeout(() => {
          SimpleReuseStrategy.waitDelete = new Set();
        }, 500)
      }
    });

  }
}
