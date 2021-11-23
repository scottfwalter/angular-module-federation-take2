#!/bin/bash

rm -rf node_modules
npm install

cd shared-angular-components
rm -rf node_modules
npm install --legacy-peer-deps
cd ..

cd app1-angular
rm -rf node_modules
npm install --legacy-peer-deps
cd ..

cd app2-angular
rm -rf node_modules
npm install --legacy-peer-deps
cd ..

cd app3-angular
rm -rf node_modules
npm install --legacy-peer-deps
cd ..

cd cxone-container
rm -rf node_modules
npm install --legacy-peer-deps
cd ..
