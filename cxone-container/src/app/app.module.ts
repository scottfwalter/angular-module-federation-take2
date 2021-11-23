/* Core Angular Imports */
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

/* CXOne Infra Imports */
import { I18NEXT_SERVICE } from 'angular-i18next';
import {
    AppInitializerFactory, ConfigurationService, CXOneHttpRequestInterceptor,
    CXOneHttpResponseInterceptor, DynamicLocaleId, LocalizationInitializer,
    WebAppInitializerService, WebAppInitializerServiceOptions
} from 'cxone-core-services';

/* App Infra Imports */
import { SharedModule } from './shared/shared.module';
import { AppUIRoutingModule } from './uirouting.module';

/* App Content */
import { AppComponent } from './app.component';
import { HelloWorldModule } from './helloworld/helloworld.module';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { LocalComponent } from './local-component/local-component';

import { HttpUtils} from 'cxone-client-services-platform';

export const customInitFn = async () => {
    console.debug('%cCustom Function Fired!', 'font-size:1rem;color: #FF7F50');
    await Promise.resolve();
};
@NgModule({
    declarations: [AppComponent, LocalComponent],
    imports: [
        AppUIRoutingModule,
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        SharedModule,

        /* Feature Modules */
        HelloWorldModule

    ],
    providers: [
        { provide: LOCALE_ID, useClass: DynamicLocaleId, deps: [I18NEXT_SERVICE] },
        { provide: LocalizationInitializer, useClass: LocalizationInitializer, deps: [I18NEXT_SERVICE, HttpClient, ConfigurationService] },
        { provide: APP_INITIALIZER, useFactory: AppInitializerFactory, deps: [
            LocalizationInitializer,
            ConfigurationService,
            WebAppInitializerService,
            WebAppInitializerServiceOptions
          ], multi: true },
          { provide: WebAppInitializerServiceOptions, useValue: {
            disableNotifications: false,
            customInitFn: customInitFn
          }},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CXOneHttpRequestInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CXOneHttpResponseInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
