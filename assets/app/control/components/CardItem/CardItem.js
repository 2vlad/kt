var AbstractItem = require('control/components/AbstractItem/AbstractItem');

var template = require('./CardItem.jinja');
require('./CardItem.less');


module.exports = AbstractItem.extend({
    template: template,

    events: {
        'click .u-Remove': 'removeItem'
    },

    removeItem: function (e) {
        if (confirm('Delete card?')) {
            AbstractItem.prototype.removeItem.call(this, e);
        }
    }
});
