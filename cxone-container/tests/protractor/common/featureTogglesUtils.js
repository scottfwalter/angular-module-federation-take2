var httpUtil = require('./testHttpUtils.js');
function FeatureObject(featureName, tenantName, authToken) {
    this.featureName = featureName;
    this.featureInitiallyOn = false;
    this.tenantName = tenantName;
    this.autorizationToken = authToken;

    this.getFeatureInitialState = function () {
        var that = this;
        protractor.featureToggleTestUtils.getFeature(this.featureName, this.autorizationToken).then(function (result) {
            that.featureInitiallyOn = result.toggled;
        });
    };

    this.turnFeatureOn = function () {
        return protractor.featureToggleTestUtils.addTenantToFeature(this.featureName, this.tenantName, this.autorizationToken);
    };

    this.turnFeatureOff = function () {
        return protractor.featureToggleTestUtils.removeTenantFromFeature(this.featureName, this.tenantName, this.autorizationToken);
    };

    this.getFeatureInitialState();
}

featureTogglesUtils = {
    baseFeatureTogglesUri: '/config/toggledFeatures',
    turnFeatureOn: function (featureName, token) {
        var featureRequestBody = {
            name: featureName,
            toggled: true
        };

        return httpUtil.sendRequest({
            action: 'POST',
            uri: this.baseFeatureTogglesUri + '/setFeature',
            body: featureRequestBody,
            authorization: token
        });
    },
    turnGlobalFeatureToggleOn: function (featureName, token) {
        var featureRequestBody = {
            name: featureName,
            toggled: true,
            onTenants: '*',
            offTenants: '-'
        };

        return httpUtil.sendRequest({
            action: 'POST',
            uri: '/config/toggledFeatures/setFeature',
            body: featureRequestBody,
            authorization: token
        });
    },
    turnGlobalFeatureToggleOff: function (featureName, token) {
        var featureRequestBody = {
            name: featureName,
            toggled: false,
            onTenants: '*',
            offTenants: '-'
        };
        return httpUtil.sendRequest({
                action: 'POST',
                uri: '/config/toggledFeatures/setFeature',
                body: featureRequestBody,
                authorization: token
            }
        );
    },
    turnFeatureOff: function (featureName, token) {
        var featureRequestBody = {
            name: featureName,
            toggled: false
        };
        return httpUtil.sendRequest({
                action: 'POST',
                uri: this.baseFeatureTogglesUri + '/setFeature',
                body: featureRequestBody,
                authorization: token
            }
        );
    },
    addTenantToFeature: function (featureName, tenantName, token) {
        var featureRequestBody = {
            name: featureName,
            toggled: true,
            tenant: tenantName
        };
        return httpUtil.sendRequest({
            action: 'POST',
            uri: this.baseFeatureTogglesUri,
            body: featureRequestBody,
            authorization: token
        });
    },
    removeTenantFromFeature: function (featureName, tenantName, token) {
        var featureRequestBody = {
            name: featureName,
            toggled: false,
            tenant: tenantName
        };
        return httpUtil.sendRequest({
            action: 'POST',
            uri: this.baseFeatureTogglesUri,
            body: featureRequestBody,
            authorization: token
        });
    },
    getFeature: function (featureName, token) {
        return httpUtil.sendRequest({
            action: 'GET',
            uri: this.baseFeatureTogglesUri + '/featureStatus',
            queryStringParams: {featureName: featureName},
            body: null,
            authorization: token
        });
    },
    loadFeatures: function (token) {
        var that = this;
        return browser.executeScript(protractor.adminUtilsNoUI.getToken).then(function (token) {
            return httpUtil.sendRequest({
                action: 'GET',
                uri: that.baseFeatureTogglesUri,
                body: null,
                authorization: token
            });
        });
    },
    generateFeatureObject: function (featureName, tenantName, token) {
        return new FeatureObject(featureName, tenantName, token)
    }
};


module.exports = featureTogglesUtils;