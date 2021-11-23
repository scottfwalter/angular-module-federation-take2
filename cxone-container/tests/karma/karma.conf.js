// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '../../src',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random :  false
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../target/reports/coverage'),
      reports: ['html', 'lcovonly', 'cobertura'],
      fixWebpackSourcePaths: true,
      'report-config': {
        cobertura: {
          file: 'cobertura.xml'
        }
      },
    },

    reporters: ['progress', 'junit'],
    junitReporter: {
      outputFile: require('path').join(__dirname, '../../target/target/reports/junit/TESTS-xunit.xml'),
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessWithOptions'],
    customLaunchers: {
      ChromeHeadlessWithOptions: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu'
        ]
      }
    },
    concurrency: 3,
    singleRun: false
  });
};
