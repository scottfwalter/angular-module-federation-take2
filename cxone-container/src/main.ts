// import {enableProdMode} from '@angular/core';
// import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import {AppModule} from './app/app.module';
// import {environment} from './environments/environment';
// import {UIRouter} from '@uirouter/angular';
// import { PasswordExpiringService } from 'cxone-core-services';

// if (environment.production) {
//     enableProdMode();
// }

// platformBrowserDynamic().bootstrapModule(AppModule).then(platformRef => {
//     platformRef.injector.get(UIRouter);
//     const service = platformRef.injector.get(PasswordExpiringService);
//     service.showPasswordToastIfExpiring();
// }).catch(err => console.error(err));

// import { loadRemoteEntry } from '@angular-architects/module-federation';

// Promise.all([
//     loadRemoteEntry('http://localhost:5001/remoteEntry.js', 'app1Angular')
// ])
// .catch(err => console.error('Error loading remote entries', err))
// .then(() => import('./bootstrap'))
// .catch(err => console.error(err));

import('./bootstrap')
	.catch(err => console.error('OOPS', err));
