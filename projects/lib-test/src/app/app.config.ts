import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, RouteReuseStrategy} from '@angular/router';

import {routes} from './app.routes';
import {SimpleReuseStrategy} from 'z-ngx-tabs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    {provide: RouteReuseStrategy, useClass: SimpleReuseStrategy}, // 提供z-ngx-tabs提供的路由复用策略
  ]
};
