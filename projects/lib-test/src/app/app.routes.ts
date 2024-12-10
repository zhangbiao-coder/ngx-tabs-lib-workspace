import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {TabsComponent} from './tabs/tabs.component';
import {Tab1Component} from './tabs/tab1/tab1.component';
import {Tab3Component} from './tabs/tab3/tab3.component';
import {Tab2Component} from './tabs/tab2/tab2.component';
import {Tab4Component} from './tabs/tab4/tab4.component';
import {Tab5Component} from './tabs/tab5/tab5.component';
import {Tab6Component} from './tabs/tab6/tab6.component';

export const routes: Routes = [{
  path:'home',
  component:HomeComponent
},{
  path:'tabs',
  component:TabsComponent,
  children:[
    {path:"tab1",component:Tab1Component},
    {path:"tab2",component:Tab2Component},
    {path:"tab3",component:Tab3Component},
    {path:"tab4",component:Tab4Component},
    {path:"tab5",component:Tab5Component},
    {path:"tab6",component:Tab6Component},
  ]
}];
