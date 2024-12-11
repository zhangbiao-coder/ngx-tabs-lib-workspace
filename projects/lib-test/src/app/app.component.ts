import {Component} from '@angular/core';
import {ITabType, TabsComponent} from 'z-ngx-tabs';

@Component({
  selector: 'app-root',
  imports: [
    TabsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  datasource: Array<ITabType> = [
    {id: "home", title: "首页", path: "/home",active:true},
    {id: "tab1", title: "tab1", canClose: true, path: "/tabs/tab1",ignoreStrong:true},
    {id: "tab2", title: "tab2", canClose: true, path: "/tabs/tab2"},
    {id: "tab3", title: "tab3", canClose: true, path: "/tabs/tab3"},
    {id: "tab4", title: "tab4", canClose: true, path: "/tabs/tab4"},
  ]

  addTab() {
    let i = this.datasource.length;
    this.datasource.push({
      id: "tab" + i,
      title: "tab" + i,
      canClose: true,
      path: "/tabs/tab" + i
    });
  }

  protected readonly console = console;
  protected readonly close = close;

  activeTab(id: string) {
    console.log(id)
  }

  closeTab(ids: string[]) {
    console.log(ids)

  }
}
