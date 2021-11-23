const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json')
  // path.join(__dirname, '../../tsconfig.json'),
  // ['auth-lib']
);


module.exports = {
  output: {
    uniqueName: 'cxone-container',
    publicPath: 'auto'
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases()
    }
  },
  plugins: [
    new ModuleFederationPlugin({

      // For hosts (please adjust)
      remotes: {
      },


      shared: share({
        '@angular/core': {  singleton: true, strictVersion: true, requiredVersion: 'auto'  },
        '@angular/common': {  singleton: true, strictVersion: true, requiredVersion: 'auto'  },
        '@angular/router': {  singleton: true, strictVersion: true, requiredVersion: 'auto'  },
        '@angular/common/http': {  singleton: true, strictVersion: true, requiredVersion: 'auto' },
        'cxone-client-services-platform': { singleton: true, strictVersion: true, requiredVersion: '^8.85.0'},
        "components-lib": { singleton: true, strictVersion: true, requiredVersion: false},
        "useless-lib": {  singleton: true },
        "rxjs": {singleton: true, strictVersion: true, requiredVersion: '^6.0.0'},
        "shared-js-lib": { singleton: true, strictVersion: true, requiredVersion: "1.0.0"},

        // Uncomment for sharing lib of an Angular CLI or Nx workspace
        ...sharedMappings.getDescriptors()
      })
    }),
    // Uncomment for sharing lib of an Angular CLI or Nx workspace
    sharedMappings.getPlugin()
  ]
};