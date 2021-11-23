var EC = protractor.ExpectedConditions;
var WfmDropdown = require('niceDropdown.po.js');
var fs = require('fs');
var testEmailUtils = require('./testEmailUtils.js');

testsUtils = {
    validPassword: 'Pass1234',
    validUserPassword: 'Password1',
    lambdaUserPassword: 'A123456b',
    validMailDomain: 'wfosaas.com',
    syntheticMonitorPassword: 'Pass123456',
    ENVIRONMENTS: {
        dev: 'dev',
        test: 'test',
        staging: 'staging'
    },
    REGIONS: {
        na1: 'na1',
        nvir: 'nvir'
    },
    getRandomString: function (str) {
        var randVal = Date.now();
        if (str)
            return str + randVal;
        else
            return randVal;
    },

    maximizeBrowserWindow: function () {
        return browser.driver.manage().window().maximize();
    },

    removeTrailingSlashFromBaseUrl: function () {
        var browserBaseUrl = browser.baseUrl;

        if (browserBaseUrl) {
            if (browserBaseUrl[browserBaseUrl.length - 1] === '/') {
                //removing the ending slash as the context will start with a slash
                browserBaseUrl = browserBaseUrl.substring(0, browserBaseUrl.length - 1);
            }
        }

        return browserBaseUrl;
    },
    waitForItemToBeClickable: function (elem, timeout) {
        var time = timeout || 10000;
        return browser.wait(EC.elementToBeClickable(elem), time);
    },
    randomInt: function (min, max) {
        // min = 0, max = 10 ---> returns 0-9
        return Math.floor(Math.random() * (max - min)) + min;
    },
    getAppContext: function () {
        var config = JSON.parse(fs.readFileSync(__dirname + '/../../../build/assets/conf/configuration.json', 'utf8'));
        return config.appContext;
    },
    getLoginContext: function () {
        return '/login';
    },

    createDailyRule: function (name) {
        var DailyRulesPage = require('dailyRule.po.js'),
            DailyRulesPage = new DailyRulesPage();

        return DailyRulesPage.createDailyRule(name);
    },
    addEmployees: function (dontClickOnEmployeeTab) {
        var Employees = require('addEmployees.po.js'),
            Employees = new Employees();

        return Employees.addFirstEmployee(dontClickOnEmployeeTab);
    },
    createWeeklyRule: function (name) {
        var WeeklyRules = require('weeklyRules.po.js'),
            WeeklyRules = new WeeklyRules();

        return WeeklyRules.createWeeklyRule(name);
    },
    createScheduleUnit: function (name) {
        var EmployeeGroups = require('employeeGroups.po.js'),
            employeeGroups = new EmployeeGroups();
        employeeGroups.navigateTo();
        browser.waitForAngular();
        return employeeGroups.addGroup(name);
    },
    waitUntilVisible: function (elem, time) {
        var timeToWait = 10000;
        if (time) {
            timeToWait = time;
        }
        return browser.wait(EC.presenceOf(elem), 30000);
    },
    waitUntilNotVisible: function (elem, time) {
        var timeToWait = 10000;
        if (time) {
            timeToWait = time;
        }
        return browser.wait(EC.not(EC.presenceOf(elem)), timeToWait);
    },
    waitUntilDisplayed: function (elem, time) {
        var timeToWait = 10000;
        if (time) {
            timeToWait = time;
        }
        return browser.wait(function () {
            return elem.isDisplayed().then(function (isDisplayed) {
                return isDisplayed;
            });
        }, 30000);
    },
    waitUntilNotDisplayed: function (elem, time) {
        var timeToWait = 10000;
        if (time) {
            timeToWait = time;
        }
        return browser.wait(function () {
            return elem.isDisplayed().then(function (isDisplayed) {
                return !isDisplayed;
            });
        }, timeToWait);
    },
    waitUntilNotPresent: function (elem, time) {
        var EC = protractor.ExpectedConditions;
        var timeToWait = 10000;
        if (time) {
            timeToWait = time;
        }
        return browser.wait(EC.stalenessOf(elem), timeToWait);
    },
    waitForToastToBeShownAndHidden: function () {
        return this.closeAllBottomMessages();
    },
    destroyAccount: function () {
        //TODO impl when we have the API
        var deferred = protractor.promise.defer();
        deferred.fulfill();

        return deferred.promise;
    },
    promiseResolve: function () {
        var deferred = protractor.promise.defer();
        deferred.fulfill();
        return deferred.promise;
    },
    login: function (email, password, landingPageUrl) {
        if (landingPageUrl === undefined) {
            landingPageUrl = protractor.baseApiUrl;
        }
        var deferred = protractor.promise.defer();
        browser.driver.get(protractor.AUTH_APP_URL + '/login/#/').then(function () {
            browser.wait(EC.presenceOf(element(by.id('emailFieldNext'))), 15000, 'login page not fully loaded yet').then(function () {
                protractor.testUtils.waitUntilVisible(element(by.id('emailFieldNext'))).then(function () {
                    element(by.id('emailFieldNext')).sendKeys(email).then(function () {
                        protractor.testUtils.waitForItemToBeClickable(element(by.id('nextBtn'))).then(function () {
                            element(by.id('nextBtn')).click().then(function () {
                                protractor.testUtils.waitUntilVisible(element(by.id('mfaPassField'))).then(function () {
                                    element(by.id('mfaPassField')).sendKeys(password).then(function () {
                                        protractor.testUtils.waitForItemToBeClickable(element(by.id('mfaLoginBtn'))).then(function () {
                                            element(by.id('mfaLoginBtn')).click().then(function () {
                                                protractor.testUtils.waitForPage(landingPageUrl, 'login/').then(function () {    // wait until the landing page is loaded - not login/#
                                                    browser.driver.getCurrentUrl().then(function (url) {
                                                        browser.executeScript('return window.localStorage.getItem("wfo_saas.userToken");').then(function (token) {
                                                            deferred.fulfill(token);
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        return deferred.promise;

    },

    loginwithMFAToken: function (email, password, MFAToken) {
        var deferred = protractor.promise.defer();
        browser.driver.get(protractor.AUTH_APP_URL + '/login/#/').then(function () {
            browser.wait(EC.presenceOf(element(by.model('user.email'))), 10000, 'login page not fully loaded yet').then(function () {
                protractor.testUtils.waitUntilVisible(element(by.id('emailFieldNext'))).then(function () {
                    element(by.id('emailFieldNext')).sendKeys(email).then(function () {
                        protractor.testUtils.waitForItemToBeClickable(element(by.id('nextBtn'))).then(function () {
                            element(by.id('nextBtn')).click().then(function () {
                                protractor.testUtils.waitUntilVisible(element(by.id('mfaPassField'))).then(function () {
                                    element(by.id('mfaPassField')).sendKeys(password).then(function () {
                                        protractor.testUtils.waitUntilVisible(element(by.id('mfaField'))).then(function () {
                                            element(by.id('mfaField')).sendKeys(MFAToken).then(function () {
                                                protractor.testUtils.waitForItemToBeClickable(element(by.id('mfaLoginBtn'))).then(function () {
                                                    element(by.id('mfaLoginBtn')).click().then(function () {
                                                        protractor.testUtils.waitForPage(protractor.baseApiUrl, 'login/#').then(function () {    // wait until the landing page is loaded - not login/#
                                                            browser.driver.getCurrentUrl().then(function (url) {
                                                                browser.executeScript('return window.localStorage.getItem("wfo_saas.userToken");').then(function (token) {
                                                                    deferred.fulfill(token);
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        return deferred.promise;

    },

    loginwithInvalidMFAToken: function (email, password, MFAToken) {
        var deferred = protractor.promise.defer();
        browser.driver.get(protractor.AUTH_APP_URL + '/login/#/').then(function () {
            browser.wait(EC.presenceOf(element(by.model('user.email'))), 10000, 'login page not fully loaded yet').then(function () {
                protractor.testUtils.waitUntilVisible(element(by.id('emailFieldNext'))).then(function () {
                    element(by.id('emailFieldNext')).sendKeys(email).then(function () {
                        protractor.testUtils.waitForItemToBeClickable(element(by.id('nextBtn'))).then(function () {
                            element(by.id('nextBtn')).click().then(function () {
                                protractor.testUtils.waitUntilVisible(element(by.id('mfaPassField'))).then(function () {
                                    element(by.id('mfaPassField')).sendKeys(password).then(function () {
                                        protractor.testUtils.waitUntilVisible(element(by.id('mfaField'))).then(function () {
                                            element(by.id('mfaField')).sendKeys(MFAToken).then(function () {
                                                deferred.fulfill();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        return deferred.promise;
    },

    loginWithoutExpectation: function (email, password) {
        var deferred = protractor.promise.defer();
        browser.driver.get(protractor.AUTH_APP_URL + '/login/#/').then(function () {
            browser.wait(EC.presenceOf(element(by.model('user.email'))), 10000, 'login page not fully loaded yet').then(function () {
                protractor.testUtils.waitUntilVisible(element(by.id('emailFieldNext'))).then(function () {
                    element(by.id('emailFieldNext')).sendKeys(email).then(function () {
                        protractor.testUtils.waitForItemToBeClickable(element(by.id('nextBtn'))).then(function () {
                            element(by.id('nextBtn')).click().then(function () {
                                protractor.testUtils.waitUntilVisible(element(by.id('mfaPassField'))).then(function () {
                                    element(by.id('mfaPassField')).sendKeys(password).then(function () {
                                        protractor.testUtils.waitForItemToBeClickable(element(by.id('mfaLoginBtn'))).then(function () {
                                            element(by.id('mfaLoginBtn')).click().then(function () {
                                                deferred.fulfill();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        return deferred.promise;
    },

    loginWithoutNavigation: function (email, password) {
        element(by.model('user.email')).sendKeys(email);
        element(by.model('user.password')).sendKeys(password);
        element(by.id('loginBtn')).click();
    },

    refreshWindowWithBrowserDriver: function (page) {
        var deferred = protractor.promise.defer();
        browser.driver.navigate().then(function () {
            protractor.testUtils.waitForPage(page).then(function () {
                deferred.fulfill();
            });
        });

        return deferred.promise;
    },
    logout: function () {
        var deferred = protractor.promise.defer();
        var EC = protractor.ExpectedConditions;
        var logoutElement = element(by.css('.nice-message-modal-wrapper .modal-footer .btn-primary'));
        browser.refresh().then(function () {
            element(by.css('#simple-dropdown')).waitReady('withRefresh').then(function () {
                    var logoutLink = element(by.id('Logout'));
                    var loginPage = element(by.css('.login-page'));
                    element(by.css('#simple-dropdown')).click().then(function () {
                        logoutLink.click().then(function () {
                            protractor.testUtils.waitUntilVisible(logoutElement).then(function () {
                                logoutElement.click().then(function () {
                                    protractor.testUtils.waitForPage('/login/#/').then(function () {
                                        browser.wait(EC.presenceOf(loginPage), 10000).then(function () {
                                            deferred.fulfill();
                                        });
                                    });
                                });
                            });
                        });
                    });
                })
            });
            return deferred.promise;
    },
    refresh: function () {
        return browser.driver.navigate().refresh();
    },
    navigateTo: function (page) {
        var deferred = protractor.promise.defer();
        browser.get(page).then(function () {
            protractor.testUtils.waitForPage(page).then(function () {
                deferred.fulfill();
            });
        });

        return deferred.promise;
    },
    navigateToWithDriver: function (page) {
        var deferred = protractor.promise.defer();
        browser.getCurrentUrl().then(function (actualUrl) {
            if (page !== actualUrl) {
                browser.driver.get(page).then(function () {
                    protractor.testUtils.waitForPage(page).then(function () {
                        deferred.fulfill();
                    });
                });
            } else {
                browser.driver.navigate().refresh().then(function () {
                    deferred.fulfill();
                });
            }
        });

        return deferred.promise;
    },
    hasClass: function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    },

    fillUserFields: function (myemail, fieldsToFill, values) {
        if (!myemail) {
            myemail = this.getRandomEmail();
        }
        //var _ = require('lodash');
        var currentField;
        var deferred = protractor.promise.defer();
        var promiseArray = [];
        if (values === undefined) {
            values = {};
        }

        if (fieldsToFill === undefined || this.arrayIncludes(fieldsToFill, 'firstName')) {
            promiseArray.push(element(by.model('user.firstName')).clear().sendKeys(values.firstName || 'ufn'));
        }
        if (fieldsToFill === undefined || this.arrayIncludes(fieldsToFill, 'lastName')) {
            promiseArray.push(element(by.model('user.lastName')).clear().sendKeys(values.lastName || 'uln'));
        }
        if (fieldsToFill === undefined || this.arrayIncludes(fieldsToFill, 'emailAddress')) {
            promiseArray.push(element(by.id('emailAddress')).clear().sendKeys(myemail));
        }
        if (fieldsToFill === undefined || this.arrayIncludes(fieldsToFill, 'mobileNumber')) {
            promiseArray.push(element(by.model('user.mobileNumber')).clear()
                .sendKeys(values.mobileNumber || protractor.testUtils.getFullRandomString(10, '1234567890')));
        }
        if (fieldsToFill === undefined || this.arrayIncludes(fieldsToFill, 'rank')) {
            promiseArray.push(element(by.model('user.rank')).clear().sendKeys(values.rank || '1'));
        }
        if ((fieldsToFill === undefined || this.arrayIncludes(fieldsToFill, 'role')) && values.role !== undefined) {
            promiseArray.push(new WfmDropdown(element(by.css('#user_roles'))).selectItemByLabel(values.role));
        }

        protractor.promise.all(promiseArray).then(function () {
            deferred.fulfill(myemail);
        });

        return deferred.promise;
    },

//assuming account was already created and state is userManagement
    createNewUser: function (myemail, values) {
        var that = this;
        var saveButton = element(by.css('button#saveWithPopoverBtn'));
        return browser.wait(function () {
            return element(by.id('newUser')).isPresent();
        }, 15000).then(function () {
            return element(by.id('newUser')).click();
        }).then(function () {
            myemail = that.fillUserFields(myemail, undefined, values);
            return browser.actions().mouseMove(saveButton).click().perform();
        }).then(function () {
            return myemail;
        });
    },

    addUserWithRoleAndActivate: function (orgName, adminCred, userCred, userRole, token) {
        // add new user with role to existing tenant and activate this user and perform login

        var deferred = protractor.promise.defer()
        protractor.testUtils.maximizeBrowserWindow();

        protractor.testUtilsNoUI.createNewUser(userCred.email, {role: userRole}).then(function () {
            protractor.testUtilsNoUI.inviteUserByEmail(userCred.email, adminCred.email, token).then(function () {
                return testEmailUtils.goToAccountActivationUrl(userCred.email, orgName);
            }).then(function () {
                return browser.driver.getCurrentUrl();
            }).then(function (url) {
                console.log('URL is ' + url);
                var res = url.split("email=");
                var data = res[1].split('&');
                console.log('Email Id is ' + data[0] + '  And token is ' + data[1].replace('token=', ''));
                return protractor.testUtilsNoUI.setPasswordNoUI(data[0], userCred.password, data[1].replace('token=', ''));
            }).then(function (response) {
                console.log('This is response ' + response);
                deferred.fulfill();
            });
        });
        return deferred.promise;
    },

    arrayIncludes: function (arr, item) {
        var exists = false;
        arr.forEach(function (currentValue) {
            if (currentValue === item) {
                exists = true;
                return;
            }
        });
        return exists;
    },

    getFullRandomString: function (length, characterOverride) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (characterOverride) {
            possible = characterOverride;
        }

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    getFullRandomUnicodeString: function (length, characterOverride) {
        var text = '';
        var possible = 'ちこそしいはきくにまのりもみらせたすとかなひてさんつぬふあうえおやゆよわ';
        if (characterOverride) {
            possible = characterOverride;
        }

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    getRandomEmail: function (length) {
        var defaultLength = 4;
        var timestamp = (new Date()).getTime();
        return this.getFullRandomString(length || defaultLength).toLowerCase() + '.' + timestamp + '@wfosaas.com';
    },
    waitForPage: function (searchUrl, notInUrl) {
        var deferred = protractor.promise.defer();

        browser.driver.wait(function () {
            return browser.driver.getCurrentUrl().then(function (url) {
                if (notInUrl === undefined) {
                    return url.indexOf(searchUrl) > -1;
                }
                return url.indexOf(searchUrl) > -1 && url.indexOf(notInUrl) === -1;
            });
        }, 120000).then(function () {
            browser.driver.sleep(5000).then(function () {
                deferred.fulfill();
            });
        });

        return deferred.promise;
    },

    loginAndGetToGroups: function (emailAdd, password) {
        protractor.testUtils.createAccount(emailAdd, password);
        wasAccountCreated = true;
        // create user:
        var timestamp = this.getRandomString();
        var myEmail = protractor.testUtils.getRandomEmail(5);
        this.createNewUser(myEmail);

        browser.wait(function () {
            return element(by.css('.ag-row')).isPresent();
        }, 10000)
            .then(function () {
                browser.get(protractor.testUtils.getWFMAppContext() + '/#/employeeGroups');
            });
    },

    loginAndGetTo: function (emailAdd, password, url) {
        protractor.testUtils.createAccount(emailAdd, password);
        wasAccountCreated = true;
        // create user:
        var timestamp = this.getRandomString();
        var myEmail = this.getRandomEmail(5);
        this.createNewUser(myEmail);

        browser.wait(function () {
            return element(by.css('.ag-row')).isPresent();
        }, 10000)
            .then(function () {
                browser.get(url);
            });
    },

    setCheckboxValue: function (element, isChecked) {
        element.element(by.css('[type="checkbox"]')).isSelected().then(function (isSelected) {
            if (isChecked && !isSelected) {
                element.click();
            } else if (!isChecked && isSelected) {
                element.click();
            }
        });
    },

    clickCheckBoxRetry: function (element) {
        var deferred = protractor.promise.defer();
        element.element(by.css('[type="checkbox"]')).isSelected().then(function (isSelected) {
            if (isSelected) {
                deferred.fulfill();
            }
            else {
                element.element(by.tagName('label')).click().then(function () {
                    deferred.fulfill();
                });
            }
        });
        return deferred.promise;
    },

    setWfmCheckboxValue: function (element, isChecked) {
        var self = this;
        var deferred = protractor.promise.defer();
        element.element(by.css('[type="checkbox"]')).isSelected().then(function (isSelected) {
            if (isChecked && !isSelected) {
                element.element(by.tagName('label')).click().then(function () {
                    self.clickCheckBoxRetry(element).then(function () {
                        deferred.fulfill();
                    });
                });
            } else if (!isChecked && isSelected) {
                element.element(by.tagName('label')).click().then(function () {
                    deferred.fulfill();
                });
            } else {
                deferred.fulfill();
            }
        });

        return deferred.promise;
    },

    getWfmCheckboxValue: function (element) {
        return element.element(by.css('[type="checkbox"]')).isSelected().then(function (isSelected) {
            return isSelected;
        });
    },

    gridUtils: {
        getFirstRow: function () {
            return element.all(by.css('.ag-row')).first();
        },
        getLastRow: function () {
            return element.all(by.css('.ag-row')).last();
        },
        getRowAtNum: function (row) {
            var deferred = protractor.promise.defer();
            protractor.testUtils.gridUtils.rowCount().then(function (totalRows) {
                deferred.resolve(element.all(by.css('.ag-row')).get(totalRows + row));
            });
            return deferred.promise;
        },
        openLastRow: function () {
            var deferred = protractor.promise.defer();
            protractor.testUtils.gridUtils.rowCount().then(function (totalRows) {
                element.all(by.css('.ag-row')).get(2 * totalRows - 1).click().then(function () {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        },
        getHeaderCellNum: function (headerCellNum) {
            return element.all(by.css('.ag-header-cell')).get(headerCellNum);
        },
        getCellAt: function (row, cell) {
            return element.all(by.css('.ag-row')).get(row - 3).all(by.css('.ag-cell')).get(cell);
        },
        getRowContainTextInCol: function (text, colNumber) {
            return element.all(by.xpath('//div[contains(@class, "ag-row")]/div[contains(., "' + text + '") and contains(@col-id,"' + colNumber + '")]/..')).first();
        },
        getCellAtForRowElement: function (ele, cellIndex) {
            return ele.all(by.css('.ag-cell')).get(cellIndex);
        },
        rowCount: function () {
            var deferred = protractor.promise.defer();
            element.all(by.css('.ag-row')).count().then(function (count) {
                if (count === 0) {
                    deferred.resolve(count);
                }
                else {
                    deferred.resolve(count / 3);
                }
            });
            return deferred.promise;
        },
        waitForGrid: function () {
            var deferred = protractor.promise.defer();
            protractor.testUtils.waitUntilVisible(element.all(by.css('.ag-row')).last()).then(function () {
                deferred.fulfill();
            });
            return deferred.promise;
        }
    },

    retryClickOnElement: function (element, cbClick) {
        var deferred = protractor.promise.defer();
        element.isPresent().then(function (isPresent) {
            if (isPresent) {
                deferred.fulfill();
            } else {
                cbClick().then(function () {
                    deferred.fulfill();
                });
            }
        });
        return deferred.promise;
    },

    elementIsNotVisible: function (element) {
        return browser.wait(function () {
            return element.isDisplayed().then(function (isVisible) {
                if (typeof(isVisible) != 'boolean') {
                    return isVisible.length == 0;
                }
                else {
                    return !isVisible;
                }
            }, function () {
                return false;
            });
        }, 10000);
    },
    closeAllBottomMessages: function () {
        var deferred = protractor.promise.defer();
        var elem = element.all(by.css('.toast-close-button'));
        var self = this;
        elem.count().then(function (numOfToasters) {
            if (numOfToasters > 0) {
                browser.executeScript('$(".toast-close-button").click()').then(function () {
                    deferred.fulfill(true);
                });
            }
            else {
                deferred.fulfill(true);
            }
        });

        return deferred.promise;
    },

    hasClass: function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    },

    getCurrentEnvironment: function () {
        if (browser.baseUrl.indexOf('localhost') !== -1) {
            return this.ENVIRONMENTS.dev;
        }
        return browser.baseUrl.split('.')[1];
    },

    verifyCurrentEnvironmentRegion: function (region) {
        if (browser.baseUrl.indexOf('localhost') !== -1) {
            return true;
        }
        return (browser.baseUrl.split('.')[0].indexOf(region) > -1);
    },

    isDevTheCurrentEnvironment: function () {
        return this.getCurrentEnvironment() === this.ENVIRONMENTS.dev;
    },

    isTestTheCurrentEnvironment: function () {
        return this.getCurrentEnvironment() === this.ENVIRONMENTS.test && this.verifyCurrentEnvironmentRegion(this.REGIONS.na1);
    },

    isNvirTestTheCurrentEnvironment: function () {
        return (this.getCurrentEnvironment() === this.ENVIRONMENTS.test && this.verifyCurrentEnvironmentRegion(this.REGIONS.nvir));
    },

    isStagingTheCurrentEnvironment: function () {
        return this.getCurrentEnvironment() === this.ENVIRONMENTS.staging;
    },

    isProductionTheCurrentEnvironment: function () {
        return (this.getCurrentEnvironment() !== this.ENVIRONMENTS.dev) && (this.getCurrentEnvironment() !== this.ENVIRONMENTS.test) && (this.getCurrentEnvironment() !== this.ENVIRONMENTS.staging);
    },

    getToastMessage: function () {
        return element(by.css('.toast-message')).getText();
    }
};

module.exports = testsUtils;

//adding a find by text locator (slow - use with care)
var findByText = function () {
    var using = arguments[0] || document;
    var text = arguments[1];
    var matches = [];

    function addMatchingLeaves(element) {
        if (element.children.length === 0 && element.textContent.match(text)) {
            matches.push(element);
        }
        for (var i = 0; i < element.children.length; ++i) {
            addMatchingLeaves(element.children[i]);
        }
    }

    addMatchingLeaves(using);
    return matches;
};

by.addLocator('text', findByText);

/**
 * Like the built-in cssContainingText locator except this one only matches elements with text that matches exactly.
 */
by.addLocator('cssMatchingText', function (selector, text, optionalParentElement) {
    var parentElement = optionalParentElement || document,
        matches = parentElement.querySelectorAll(selector);

    return Array.prototype.filter.call(matches, function (match) {
        return match.textContent === text;
    });
});

by.addLocator('cssChildContainingText', function (childSelector, text, optionalParentElement) {
    var parentElement = optionalParentElement || document,
        selectorResults,
        matches = [];

    function addMatchingLeaves(element) {
        if (element.children.length === 0 && element.textContent === text) {
            matches.push(element);
        }
        for (var i = 0; i < element.children.length; ++i) {
            addMatchingLeaves(element.children[i]);
        }
    }

    selectorResults = parentElement.querySelectorAll(childSelector);
    for (var i = 0; i < selectorResults.length; i += 1) {
        addMatchingLeaves(selectorResults[i]);
    }

    return Array.prototype.map.call(matches, function (child) {
        return child.parentNode;
    });
});
