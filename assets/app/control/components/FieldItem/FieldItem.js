var AbstractItem = require('control/components/AbstractItem/AbstractItem');

var template = require('./FieldItem.jinja');
require('./FieldItem.less');


module.exports = AbstractItem.extend({
    template: template,

    events: {
        'click .u-Remove': 'removeItem'
    },

    removeItem: function (e) {
        if (confirm('Delete field?')) {
            AbstractItem.prototype.removeItem.call(this, e);
        }
    }
});
