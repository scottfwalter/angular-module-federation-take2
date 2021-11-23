var https = require('https');
var querystring = require('querystring');

var INBOX_CHECK_RETRY_COUNT_LIMIT = 10;
var INBOX_CHECK_RETRY_SLEEP_MILLIS = 15000;
var TEST_EMAIL_HOST = 'gxhbx2e8ua.execute-api.us-west-2.amazonaws.com';
var TEST_EMAIL_PATH = '/prod/ReadProtractorEmail';
var TEST_EMAIL_API_KEY = 'gTU6UDsZf13AOCDERT4In4sawqNDjOXt5QTmlxeo';
var SUBJECT_RESETPWD_ACTIVATION = 'CXone: Password Recovery Code';
var SUBJECT_ACCOUNT_ACTIVATION = 'Activate your NICE-inContact CXone';
var SCHEDULE_HAS_BEEN_PUBLISHED = 'Evolve WFM - New schedules has been published';
var SUBJECT_RESETPWD_ACTIVATION_LINK = 'CXone: Password Recovery Link';
var SUBJECT_VERIFY_EMAIL_LINK = 'Verify your NICE-inContact CXone email address';

function httpJson(requestOptions) {
    var deferred = protractor.promise.defer();
    var responseString = '';

    var request = https.request(requestOptions, function(response) {
        response.on('data', function(chunk) {
            responseString += chunk;
        });

        response.on('end', function() {
            var responseJson = JSON.parse(responseString);
            deferred.fulfill(responseJson);
        });
    });

    request.on('error', function(error) {
        console.log('Error in HTTP request', requestOptions, error);
        deferred.reject(error);
    });

    request.end();

    return deferred.promise;
}

function readTestEmailNoRetry(toEmailAddress, subject) {
    var deferred = protractor.promise.defer();
    var query = querystring.stringify({to: toEmailAddress, subject: subject, delete: 'true'});

    var requestOptions = {
        hostname: TEST_EMAIL_HOST,
        path: TEST_EMAIL_PATH + '?' + query,
        method: 'GET',
        headers: {
            'x-api-key': TEST_EMAIL_API_KEY
        }
    };

    console.log('Reading test email', requestOptions.hostname, requestOptions.path);

    httpJson(requestOptions).then(
        function(response) {
            if (response.content !== undefined) {
                deferred.fulfill(response);
            } else {
                deferred.reject(response);
            }
        },
        function(error) {
            console.log('Error retrieving test email', requestOptions, error);
            deferred.reject(error);
        }
    );

    return deferred.promise;
}

function readTestEmail(toEmailAddress, subject) {
    var deferred = protractor.promise.defer();
    var tryCount = 0;

    function read(toEmailAddress, subject) {
        readTestEmailNoRetry(toEmailAddress, subject).then(
            function(response) {
                deferred.fulfill(response);
            },
            function(errorResponse) {
                if (tryCount < INBOX_CHECK_RETRY_COUNT_LIMIT) {
                    console.log('Test email not yet present, trying again in ' + (INBOX_CHECK_RETRY_SLEEP_MILLIS / 1000) + ' seconds...', 'to=', toEmailAddress, 'subject=', subject);
                    browser.driver.sleep(INBOX_CHECK_RETRY_SLEEP_MILLIS).then(function() {
                        read(toEmailAddress, subject);
                    });
                } else {
                    console.log('Error retrieving test email after ' + INBOX_CHECK_RETRY_COUNT_LIMIT + ' tries, giving up!', 'to=', toEmailAddress, 'subject=', subject);
                    deferred.reject(errorResponse);
                }

                tryCount += 1;
            }
        );
    }

    read(toEmailAddress, subject);

    return deferred.promise;
}

function convertMimeChars(emailContent) {
    return emailContent.replace(/=3D/g, '=').replace(/=\r\n/g, '').replace(/=\n/g, '');
}

function getRelativeAccountActivationUrl(emailAddress, orgName) {
    var deferred = protractor.promise.defer();

    readTestEmail(emailAddress, SUBJECT_ACCOUNT_ACTIVATION + ' ' + orgName).then(
        function(response) {
            var content = convertMimeChars(response.content);
            var matchResults = content.match(/href="(.*?setPassword.*?)"/);

            if (!matchResults || matchResults.length < 2) {
                console.log('Error: Activation URL not found in Activation email!');
                deferred.reject();
            }

            var relativeUrl = matchResults[1].substring(matchResults[1].indexOf('/#'));
            deferred.fulfill(relativeUrl);
        },
        function(errorResponse) {
            console.log('Error retrieving account activation email');
            deferred.reject();
        }
    );

    return deferred.promise;
}

function buildFullUrl(originalUrl, relativeUrl) {
    var baseUrl = originalUrl.substring(0, originalUrl.indexOf('/#'));
    return baseUrl + relativeUrl;
}

function extractAreaIdentifier(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    var areaId = hostname.split('.')[0];
    return areaId;
}

function goToAccountActivationUrl(emailAddress, orgName) {
    var deferred = protractor.promise.defer();

    browser.getCurrentUrl().then(function(originalUrl) {
        getRelativeAccountActivationUrl(emailAddress, orgName).then(
            function(relativeUrl) {
                var fullUrl = buildFullUrl(originalUrl, relativeUrl);
                fullUrl = fullUrl.replace('admin', 'login');
                if(protractor.AUTH_APP_URL.indexOf('auth.') >= 0){
                    var areaId = extractAreaIdentifier(fullUrl);
                    fullUrl = fullUrl.replace(areaId, 'auth');
                }
                console.log('Navigating to account activation URL:', fullUrl);
                var waitUrl = relativeUrl.substring(relativeUrl.indexOf('#/'));
                browser.get(fullUrl).then(function() {
                    protractor.testUtils.waitForPage(waitUrl).then(function () {
                        deferred.fulfill();
                    });
                });
            },
            function(errorResponse) {
                console.log('Error retrieving relative account activation URL');
                deferred.reject();
            }
        );
    });

    return deferred.promise;
}

function getNewSchedulePublishedUrl(emailAddress) {
    var deferred = protractor.promise.defer();

    readTestEmail(emailAddress, SCHEDULE_HAS_BEEN_PUBLISHED).then(
        function(response) {
            var content = convertMimeChars(response.content);
            var indexOfMyScheduleDate = content.indexOf('mySchedule?date=');

            if (indexOfMyScheduleDate == -1) {
                console.log('Error: new schedule publish URL not found in Activation email!');
                deferred.reject();
            }

            var relativeUrl = content.substr(indexOfMyScheduleDate - 3, 29);
            deferred.fulfill(relativeUrl);
        },
        function(errorResponse) {
            console.log('Error retrieving account activation email');
            deferred.reject();
        }
    );

    return deferred.promise;
}

function goToMyScheduleUrl(emailAddress) {
    var deferred = protractor.promise.defer();

    browser.getCurrentUrl().then(function(originalUrl) {
        getNewSchedulePublishedUrl(emailAddress).then(
            function(relativeUrl) {
                var fullUrl = buildFullUrl(originalUrl, relativeUrl);
                console.log('Navigating to My Space URL:', fullUrl);
                browser.get(fullUrl);
                browser.waitForAngular();
                deferred.fulfill();
            },
            function(errorResponse) {
                console.log('Error retrieving relative My Space URL');
                deferred.reject();
            }
        );
    });

    return deferred.promise;
}

function getConfirmationCode(emailAddress) {

    var deferred = protractor.promise.defer();
    var subjectString=SUBJECT_RESETPWD_ACTIVATION;

    readTestEmail(emailAddress, subjectString).then(
        function(response) {
            var content = convertMimeChars(response.content);
            var numberPattern  = /is\s\d+/g;
            var numberPattern  = /<h1>(\d{6})/g;
            var matchResults = content.match(numberPattern);
            var confirmationNumber = matchResults[0].split(' ')[1];
            var confirmationNumber = matchResults[0].split('>')[1];
            if (!confirmationNumber || confirmationNumber.length < 6) {
                console.log('Error: password recovery URL not found in email!');
                deferred.reject();
            }

            deferred.fulfill(confirmationNumber);
        },
        function(errorResponse) {
            console.log('Error retrieving password recovery code');
            deferred.reject();
        }
    );

    return deferred.promise;
}

function getResetPasswordLinkFromEmail(emailAddress) {

    var deferred = protractor.promise.defer();
    var subjectString=SUBJECT_RESETPWD_ACTIVATION_LINK;

    readTestEmail(emailAddress, subjectString).then(
        function(response) {
            var content = convertMimeChars(response.content);
            var matchResults = content.match(/href="(.*?resetPassword.*?)"/);
            if (!matchResults || matchResults.length < 2) {
                console.log('Error: Activation URL not found in Activation email!');
                deferred.reject();
            }
            var relativeUrl = matchResults[1].substring(matchResults[1].indexOf('/#'));
            deferred.fulfill(relativeUrl);
        },
        function(errorResponse) {
            console.log('Error retrieving password recovery link');
            deferred.reject();
        }
    );

    return deferred.promise;
}

function getVerifyEmailLinkFromEmail(emailAddress) {

    var deferred = protractor.promise.defer();
    var subjectString=SUBJECT_VERIFY_EMAIL_LINK;

    readTestEmail(emailAddress, subjectString).then(
        function(response) {
            var content = convertMimeChars(response.content);
            var matchResults = content.match(/href="(.*?updateEmail.*?)"/);
            if (!matchResults || matchResults.length < 2) {
                console.log('Error: Verification URL not found in Verification email!');
                deferred.reject();
            }
            var relativeUrl = matchResults[1].substring(matchResults[1].indexOf('/#'));
            deferred.fulfill(relativeUrl);
        },
        function(errorResponse) {
            console.log('Error retrieving email verification link');
            deferred.reject();
        }
    );

    return deferred.promise;
}

function goToEmailVerificationUrl(emailAddress) {
    var deferred = protractor.promise.defer();

    browser.getCurrentUrl().then(function(originalUrl) {
        getVerifyEmailLinkFromEmail(emailAddress).then(
            function(relativeUrl) {
                var fullUrl = buildFullUrl(originalUrl, relativeUrl);
                console.log('Navigating to email verification URL:', fullUrl);
                browser.driver.get(fullUrl);
                browser.refresh();
                browser.waitForAngular();
                deferred.fulfill();
            },
            function(errorResponse) {
                console.log('Error retrieving relative email verification URL');
                deferred.reject();
            }
        );
    });

    return deferred.promise;
}

module.exports = {
    getRelativeAccountActivationUrl: getRelativeAccountActivationUrl,
    goToAccountActivationUrl: goToAccountActivationUrl,
    goToMyScheduleUrl: goToMyScheduleUrl,
    getConfirmationCode: getConfirmationCode,
    getResetPasswordLinkFromEmail: getResetPasswordLinkFromEmail,
    getVerifyEmailLinkFromEmail: getVerifyEmailLinkFromEmail,
    goToEmailVerificationUrl: goToEmailVerificationUrl
};
