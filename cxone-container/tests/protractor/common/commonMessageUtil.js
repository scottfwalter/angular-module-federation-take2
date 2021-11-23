var fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname + '/message.json', 'utf8'));
commonMessageUtil = {
     getMessage : function (message, pageId) {
        if (pageId === undefined) {
            return config['commonValidationMessages'][message];
        }
        return config[pageId][message];
    }
};
module.exports = commonMessageUtil;