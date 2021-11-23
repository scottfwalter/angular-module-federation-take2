commonLoggerUtils = {
    info: function (message, args) {
        if (args) {
            for (var i = 0; i < args.length; i++) {
                message = message.replace('{' + i + '}', args[i]);
            }
        }
        console.log('INFO :: ' + message);
    },

    warning: function (message, args) {
        if (args) {
            for (var i = 0; i < args.length; i++) {
                message = message.replace('{' + i + '}', args[i]);
            }
        }
        console.log('WARNING :: ' + message);
    },

    error: function (message, args) {
        if (args) {
            for (var i = 0; i < args.length; i++) {
                message = message.replace('{' + i + '}', args[i]);
            }
        }
        console.log('ERROR :: ' + message);
    }
};
module.exports = commonLoggerUtils;