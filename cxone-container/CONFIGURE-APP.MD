1.  Create an Angular 12+ App
2.  Run:  ng add @angular-architects/module-federation
3.   npm install @angular-architects/module-federation-tools
4. npm install @angular/elements
5.  may need to install ngx-build-plus

4.  Add to webpack.config.js under the ModuleFederationPlugin:

        name: "app2Angular",
        filename: "remoteEntry.js",
        exposes: {
            './web-components': './src/bootstrap.ts',
        },

5.  updated shaerd libraries in webpack.config.js

5.  set uniqueName in webpack.config.js



5. Update bootstrap.ts

import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { bootstrap } from '@angular-architects/module-federation-tools';


if (environment.production) {
  enableProdMode();
}

bootstrap(AppModule, {
  production: environment.production
});



6.  Update AppModule

4a.  Set bootstrap array to []
4b. create AppModule class

export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    customElements.define('app2-element', createCustomElement(AppComponent, {injector: this.injector}));
    // customElements.define('app1-hello-element', createCustomElement(HelloComponent, {injector: this.injector}));
    // customElements.define('app1-goodbye-element', createCustomElement(GoodbyeComponent, {injector: this.injector}));
  }
}



