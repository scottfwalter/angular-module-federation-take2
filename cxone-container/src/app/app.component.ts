import { Component, NgZone, OnInit, VERSION } from '@angular/core';
import fetchIntercept from 'fetch-intercept';

import { SpinnerService } from 'cxone-components/spinner';
import { shareNgZone, startsWith, WebComponentWrapper, WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
import { Router } from '@angular/router';
import { HttpUtils } from 'cxone-core-services';
import { AppDefinition } from './apps.interface';
import { URLChangeService } from 'cxone-client-services-platform';
import { AppRouteChangeService } from './app-route-change.service';
import { CounterService, EventBusService } from 'components-lib';
import { version } from 'useless-lib';
import { environment} from '../environments/environment';
import { JediService } from 'shared-js-lib';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  unregister: any;
  sidebarCollapsed: boolean;
  sidebarToggleButton: boolean;
  licenses: any;
  ngVersion: string = VERSION.full;
  uselessVersion;
  envDetails;
  jediName;

  constructor(
      private ngZone: NgZone,
      private router: Router,
      private spinnerService: SpinnerService,
      private httpUtils: HttpUtils,
      private appRouteChangeService: AppRouteChangeService,
      public counterService: CounterService,
      private eventBusService: EventBusService) {
      shareNgZone(ngZone);
      this.eventBusService.initializeEventBus();
      this.uselessVersion = version;
      this.envDetails = environment;
      this.jediName = JediService.instance.jediName;
  }

  ngOnInit() {
    this.unregister = fetchIntercept.register({
      request:  (url, config) => {
        this.spinnerService.isLoading.next(true);
        return [url, config];
      },
      requestError: (error) => {
        // Called when an error occured during another 'request' interceptor call
        this.spinnerService.isLoading.next(false);
        return Promise.reject(error);
      },
      response: (response) => {
        // Modify the reponse object
        this.spinnerService.isLoading.next(false);
        return response;
      },
      responseError:  (error) => {
        // Handle an fetch error
        this.spinnerService.isLoading.next(false);
        return Promise.reject(error);
      }
    });

    URLChangeService.instance.broadcastURLChange(URLChangeService.URL_CHANGED, {
        moduleId: 'scheduler',
        subMenuId: 'timeOffPlanning',
        pageId: 'rules'
    });
  }

  incrementCounter() {
    this.counterService.incremet(100);
  }

  sendEventToChildren() {
    this.eventBusService.emitEvent('helloEvent', {message: 'Well Hello There!'});
  }

  publishViaRXJS() {
    JediService.instance.publishValue('Hello there Jedi Knight!');
    console.log('should have published');
  }
}
