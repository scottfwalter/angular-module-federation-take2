module.exports = (function() {
    'use strict';

    var _ = require('../../../vendor_old/lodash/lodash.min.js');

    var WEEKDAYS = [
        {id: 0, shortKey: 'SUN', longKey: 'SUNDAY'},
        {id: 1, shortKey: 'MON', longKey: 'MONDAY'},
        {id: 2, shortKey: 'TUE', longKey: 'TUESDAY'},
        {id: 3, shortKey: 'WED', longKey: 'WEDNESDAY'},
        {id: 4, shortKey: 'THU', longKey: 'THURSDAY'},
        {id: 5, shortKey: 'FRI', longKey: 'FRIDAY'},
        {id: 6, shortKey: 'SAT', longKey: 'SATURDAY'}
    ];

    return {
        all: function() {
            return _.cloneDeep(WEEKDAYS);
        },

        byId: function(id) {
            return _.cloneDeep(_.findWhere(WEEKDAYS, {id: id}));
        },

        byShortKey: function(shortKey) {
            return _.cloneDeep(_.findWhere(WEEKDAYS, {shortKey: shortKey}));
        },

        byLongKey: function(longKey) {
            return _.cloneDeep(_.findWhere(WEEKDAYS, {longKey: longKey}));
        }
    };
})();
