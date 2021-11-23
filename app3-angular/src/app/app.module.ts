import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
``
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { HelloModule } from './hello/hello.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HelloModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}


