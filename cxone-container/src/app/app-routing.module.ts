import { loadRemoteModule } from '@angular-architects/module-federation';
import {WebComponentWrapper, WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
// import { startsWith, WebComponentWrapper, WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes, UrlMatcher, UrlSegment } from '@angular/router';
import { HttpUtils } from 'cxone-core-services';
import { AppDefinition } from './apps.interface';
import { HelloworldComponent } from './helloworld/helloworld.component';
import { LocalComponent } from './local-component/local-component';

export function startsWith(prefix: string): UrlMatcher {
  console.log('SSS');
  return (url: UrlSegment[]) => {
    console.log('SSS1');
      const fullUrl = url.map(u => u.path).join('/');
      console.log('SSS2', fullUrl);
      if (fullUrl.startsWith(prefix)) {
        console.log('SSS3', url);
          return ({ consumed: url});
      }
      console.log('SSS4');
      return null;
  };
}

const APP_ROUTES: Routes = [
  {
    path: '',
    component: HelloworldComponent,
    pathMatch: 'full'
  },
  {
    path: 'scott',
    component: LocalComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router, private httpUtils: HttpUtils) {
    this.httpUtils.get('./assets/conf/apps.json').subscribe( (data: any) => {
      this.addRoutes(data.apps);

      this.router.resetConfig([
        {
          path: 'app3',
          loadChildren: () =>
            loadRemoteModule({
              remoteEntry: 'http://localhost:5003/remoteEntry.js',
              remoteName: 'app3Angular',
              exposedModule: './HelloModule',
            }).then((m) => m.HelloModule),
        },
        ...this.router.config,
      ]);
    });
  }

  addRoutes(apps: AppDefinition[]) {
    for (const app of apps) {
      const routeDef: any = {
        component: WebComponentWrapper,
        data: {
          remoteEntry: app.remoteEntry,
          remoteName:  app.remoteName,
          exposedModule: app.exposedModule,
          elementName: app.elementName
        } as WebComponentWrapperOptions
      };

      if (app.path) {
        routeDef.path = app.path;
      }

      if (app.startsWith) {
        routeDef.matcher = startsWith(app.startsWith);
      }

      this.router.resetConfig([
        routeDef,
        ...this.router.config,
      ]);

      console.log('Adding App', routeDef);
    }
  }
}
