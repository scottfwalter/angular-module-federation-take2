/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, NgModule, NgZone, PlatformRef, Type} from '@angular/core';
import {downgradeComponent, UpgradeModule} from '@angular/upgrade/static';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

declare var ng: any;

declare interface TestHybridModuleMetadata {
  componentToTestSelector?: string;
  angularProviders?: any[];
  angularDeclarations?: any[];
  angularImports?: any[];
  angularjsModulesDependencies?: any[];
}

const HYBRID_TEST_CONTAINER = 'HybridTestContainer';


function defineHybridTestingModule(config: TestHybridModuleMetadata) {
// Define `Ng2Component`
  @Component({selector: 'ng2', template: `<${config.componentToTestSelector}></${config.componentToTestSelector}>`})
  class Ng2Component {
  }

  // Define `Ng2Module`
  @NgModule({
    declarations: [Ng2Component, ...(config.angularDeclarations || [])],
    entryComponents: [Ng2Component],
    imports: [BrowserModule, UpgradeModule, ...(config.angularImports || [])]
  })
  class Ng2Module {
    ngDoBootstrap() {
    }
  }

  // Bootstrap
  const element = html(`<ng2></ng2>`);
  return {Ng2Module, element};
}

export function removeTestedElementFromDom() {
  const htmlElement = document.getElementById(HYBRID_TEST_CONTAINER);
  htmlElement.parentNode.removeChild(htmlElement);
}

export function html(htmlEl: string): Element {
  // Don't return `body` itself, because using it as a `$rootElement` for ng1
  // will attach `$injector` to it and that will affect subsequent tests.
  const elementToTest = document.createElement('div');
  elementToTest.setAttribute('id', HYBRID_TEST_CONTAINER);
  elementToTest.innerHTML = htmlEl.trim();
  document.body.appendChild(elementToTest);
  const div = document.body.lastChild as Element;

  if (div.childNodes.length === 1 && div.firstChild instanceof HTMLElement) {
    return div.firstChild;
  }

  return div;
}

export function multiTrim(text: string | null | undefined, allSpace = false): string {
  if (typeof text === 'string') {
    const repl = allSpace ? '' : ' ';
    return text.replace(/\n/g, '').replace(/\s+/g, repl).trim();
  }
  throw new Error('Argument can not be undefined.');
}

export function nodes(htmlEl: string) {
  const div = document.createElement('div');
  div.innerHTML = htmlEl.trim();
  return Array.prototype.slice.call(div.childNodes);
}

export function CreateHybridTestingModule(config: TestHybridModuleMetadata) {
  // We bootstrap the Angular module first; then when it is ready (async) we bootstrap the AngularJS
  // module on the bootstrap element (also ensuring that AngularJS errors will fail the test).
  const {Ng2Module, element} = defineHybridTestingModule(config);
  return platformBrowserDynamic().bootstrapModule(Ng2Module).then(ref => {
    const ngZone = ref.injector.get<NgZone>(NgZone);
    const upgradeRef = ref.injector.get(UpgradeModule);
    const failHardModule: any = ($provide: any) => {
      $provide.value('$exceptionHandler', (err: any) => {
        throw err;
      });
    };

    // The `CreateHybridTestingModule()` helper is used for convenience in tests, so that we don't have to inject
    // and call `upgradeRef.CreateHybridTestingModule()` on every Angular module.
    // In order to closer emulate what happens in real application, ensure AngularJS is bootstrapped
    // inside the Angular zone.
    //
    const debugElement = ng.probe(element.getElementsByTagName('app-messages')[0]);
    return {upgradeRef, debugElement};
  });
}

export function $apply(adapter: UpgradeModule, exp: any) {
  const $rootScope = adapter.$injector.get('$rootScope');
  $rootScope.$apply(exp);
}

export function $digest(adapter: UpgradeModule) {
  const $rootScope = adapter.$injector.get('$rootScope');
  $rootScope.$digest();
}
