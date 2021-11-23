/**
 * Actively wait for an element to be present and displayed up to specTimeoutMs
 * ignoring useless webdriver errors.
 */
"use strict";

// Config
var specTimeoutMs = 30000; // 30 seconds
var ElementFinder = $('').constructor;

ElementFinder.prototype.waitReady = function(opt_optStr) {
    var self = this;
    var driverWaitIterations = 0;
    var lastWebdriverError;
    function _throwError() {
        throw new Error("Expected '" + self.locator().toString() +
            "' to be present and visible. " +
            "After " + driverWaitIterations + " driverWaitIterations. " +
            "Last webdriver error: " + lastWebdriverError);
    };

    function _isPresentError(err) {
        lastWebdriverError = (err != null) ? err.toString() : err;
        return false;
    };
        return browser.driver.wait(function () {
            driverWaitIterations++;
            if (opt_optStr === 'withRefresh') {
                // Refresh page after more than some retries
                if (driverWaitIterations > 3) {
                    _refreshPage();
                }
            }
            return self.isPresent().then(function (present) {
                if (present) {
                    return self.isDisplayed().then(function (visible) {
                        lastWebdriverError = 'visible:' + visible;
                        return visible;
                    }, _isPresentError);
                } else {
                    lastWebdriverError = 'present:' + present;
                    return false;
                }
            }, _isPresentError);
        }, specTimeoutMs).then(function (waitResult) {
            if (!waitResult) {
                _throwError()
            };
            return waitResult;
        }, function (err) {
            _isPresentError(err);
            _throwError();
            return false;
        });
};

// Helpers
function _refreshPage() {
    // Swallow useless refresh page webdriver errors
    return browser.navigate().refresh().then(function(){}, function(e){});
};