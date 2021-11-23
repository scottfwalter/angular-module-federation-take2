let userDetails = {
    orgName: 'orghttp' + protractor.testUtils.getRandomString() + protractor.testUtils.getFullRandomString(5),
    adminCreds: {
        email: 'ptor.' + protractor.testUtils.getRandomString() + '@wfosaas.com',
        password: protractor.testUtils.validPassword
    },
    firstName: 'Admin',
    lastName: 'User'
};

globalTenantUtils = {
    getDefaultTenantCredentials: function () {
        return userDetails;
    }
};

module.exports = globalTenantUtils;