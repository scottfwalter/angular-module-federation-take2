import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
``
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { createCustomElement } from '@angular/elements';
import { HelloComponent } from './hello/hello.component';
import { GoodbyeComponent } from './goodbye/goodbye.component';
// import { endsWith } from '@angular-architects/module-federation-tools';
import { RouterModule, UrlMatcher, UrlSegment } from '@angular/router';


 function endsWith(prefix: string): UrlMatcher {
   console.log('EEEEE');
  return (url: UrlSegment[]) => {
    console.log('EEEEE1');
      const fullUrl = url.map(u => u.path).join('/');
      if (fullUrl.endsWith(prefix)) {
         console.log('EEE FOUND IT');
          return ({ consumed: url });
      }

      console.log('EEE OOOPS');
      return null;
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    GoodbyeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {

    customElements.define('app1-element', createCustomElement(AppComponent, {injector: this.injector}));
    customElements.define('app1-hello-element', createCustomElement(HelloComponent, {injector: this.injector}));
    customElements.define('app1-goodbye-element', createCustomElement(GoodbyeComponent, {injector: this.injector}));
  }
}


