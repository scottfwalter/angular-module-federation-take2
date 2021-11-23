
import { NgModule } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';
import { routerConfigFn } from 'cxone-core-services';

import { HelloworldComponent } from './helloworld/helloworld.component';
const APP_STATES = [
  {
    name: 'default',
    url: '',
    component: HelloworldComponent,
    data: {
        permission: 'user:view',
        moduleId: 'scheduler',
        pageId: 'hello'
    }
  },
  {
    name: 'hello',
    url: '/hello',
    component: HelloworldComponent,
    data: {
        permission: 'user:view',
        moduleId: 'scheduler',
        pageId: 'hello'
    }
  }
];


@NgModule({
  imports: [
    UIRouterModule.forRoot({
      states: APP_STATES,
      useHash: true,
      config: routerConfigFn
  })
  ],
  exports: [UIRouterModule]
})
export class AppUIRoutingModule {}