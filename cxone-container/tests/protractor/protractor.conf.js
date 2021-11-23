// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const config = require('./base-conf.js').config;
const helpers = require('./config-helpers.js');

config.capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: [
            '--disable-web-security',
            '--ignore-certificate-errors',
            '--test-type',
            '--disable-extensions',
            '--disable-infobars'
        ],
        prefs: {
            'password_manager_enabled': false,
            'profile.password_manager_enabled': false,
            'credentials_enable_service': false
        }
    }
};

var suites = {
    suite_03: [
        '../../src/app/view-management/view-management.prot.spec.ts'
    ]
};

config.suites = suites;

exports.config = config;
