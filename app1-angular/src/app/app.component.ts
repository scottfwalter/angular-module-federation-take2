import { connectRouter } from '@angular-architects/module-federation-tools';
import { Component, OnDestroy, OnInit, VERSION, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { version } from 'useless-lib';
import { JediService } from 'shared-js-lib';

export function connectRouterScott(router: Router, useHash = false) {
  console.log('connect1', useHash);
  if (!useHash) {
      router.navigateByUrl(location.pathname.substr(1));
      window.addEventListener('popstate', () => {
          router.navigateByUrl(location.pathname.substr(1));
      });
  }
  else {
    console.log('connect2', location.hash.substr(1));
      router.navigateByUrl(location.hash.substr(1));
      window.addEventListener('hashchange', () => {
          router.navigateByUrl(location.hash.substr(1));
      });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  ngVersion: string = '';
  uselessVersion;
  jediName;
  jediSubscription;

  constructor(private router: Router) {
    console.log('WTF1',  location.hash.substr(1));
    this.uselessVersion = version;
    this.jediName = JediService.instance.jediName;
    // this.router.navigateByUrl(location.hash.substr(1));

    console.log('subroute', location.hash.substr(1));

    this.jediSubscription = JediService.instance.subject.subscribe({
      next: (v:any) => {alert('app component' + v);}
    });
  }

  ngOnDestroy(): void {
    this.jediSubscription.unsubscribe();
  }

  NavToGoodbye() {
    this.router.navigateByUrl('/angular1/goodbye');
  }

  ngOnInit(): void {
    console.log('HERE I AM');
    this.ngVersion = VERSION.full;
    connectRouterScott(this.router, true);
  }
}
