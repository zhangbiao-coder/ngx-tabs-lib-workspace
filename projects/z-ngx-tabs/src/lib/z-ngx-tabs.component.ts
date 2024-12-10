import {Component, Input} from '@angular/core';
import {TabsComponent} from './tabs/tabs.component';
import {ITabType} from './option/tab-type';

@Component({
  selector: 'z-ngx-tabs',
  imports: [
    TabsComponent
  ],
  template: `
    <lib-tabs [datasource]="datasource"></lib-tabs>
  `,
  styles: ``
})
export class ZNgxTabsComponent {
  @Input() datasource: ITabType[] = [];
}
