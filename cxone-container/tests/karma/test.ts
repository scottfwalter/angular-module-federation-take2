// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;
const testUtils = require.context('./', true, /\.spec.js$/);
testUtils.keys().map(testUtils);

const angularCodeToTest = require.context('../../src/app', true, /^(?!.*(.e2e.ts|spec.ts|po.ts)).*\.ts$/);
angularCodeToTest.keys().map(angularCodeToTest);

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('../../src', true, /^(?!.*(prot.spec.(js|ts))).*\.spec.(js|ts)$/);
// And load the modules.
context.keys().map(context);
