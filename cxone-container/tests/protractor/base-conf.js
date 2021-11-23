var helpers = require('./config-helpers.js');
var seleniumPort = process.env.DOCKER_SELENIUM_PORT || 4444;
var suiteDir = process.env.SUITE_DIR || 'target/chrome-reports';
var retry = require('protractor-retry').retry;

process.on('unhandledRejection', () => {});
exports.config = {
    // Test directly against Chrome and Firefox without using a Selenium Server.
    // If this is true, settings for seleniumAddress and seleniumServerJar will be ignored.
    //directConnect: true,

    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:' + seleniumPort + '/wd/hub',

    baseUrl: helpers.getBaseUrl(),

    // Spec patterns are relative to the configuration file location passed
    // to proractor (in this example conf.js).
    // They may include glob patterns.
    specs: ['../../src/**/app/**/*.spec.js'],

    //this function is running once before any of the tests`
    onPrepare: function () {
        //retry.onPrepare();
        helpers.commonOnPrepare({suiteDir: suiteDir});
        require('ts-node').register({
            project:'./tests/protractor/tsconfig.e2e.json',
            ignore: []
        });
        return helpers.setupDefaultReporters(suiteDir);
    },

    /*onCleanUp: function(results) {
        retry.onCleanUp(results);
    },*/

    afterLaunch: function (exitCode) {
        return helpers.mergeJUnitReports(suiteDir, exitCode);
        //return retry.afterLaunch(2);
    },

    allScriptsTimeout: 200000,
    getPageTimeout: 120000,
    framework: 'jasmine2',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 400000,
        silent: true,
        print: function () {
        }
    }
};
