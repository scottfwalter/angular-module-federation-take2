function sendRequest(requestParameters) {
    var request = require('request');
    var baseApiUrl = protractor.baseApiUrl;
    var fullUrl = baseApiUrl + requestParameters.uri;
    var requestOptions = {
        url: fullUrl,
        method: requestParameters.action,
        body: requestParameters.body,
        json: true,
        headers: {}
    };

    if (requestParameters.timeout){ //if no timeout it uses default
        requestOptions.timeout = requestParameters.timeout;
    }

    if (requestParameters.authorization) {
        requestOptions.headers['Authorization'] = 'bearer ' + requestParameters.authorization;
    }

    if(requestParameters.queryStringParams) {
        requestOptions.qs = requestParameters.queryStringParams;
    }

    var flow = protractor.promise.controlFlow();
    return flow.execute(function() {
        console.log('Http START request UTC time: ' + (new Date()).toUTCString());
        var executeDeferred = protractor.promise.defer();
         request(requestOptions, function (error, response, body) {
            console.log('Http END request UTC time: ' + (new Date()).toUTCString());
            if (!error && response.statusCode == 200) {
                executeDeferred.fulfill(body);
            } else {
                console.error('=== sent: ' + JSON.stringify(requestOptions));
                console.error('=== got: ' + error + ", response:" + JSON.stringify(response) + ", body:" + JSON.stringify(body));
                executeDeferred.reject(error);
            }
        });
        return executeDeferred.promise;
    });
}

module.exports = {
    sendRequest: sendRequest
};
