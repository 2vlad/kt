var AbstractItem = require('control/components/AbstractItem/AbstractItem');

var template = require('./CardItem.jinja');
require('./CardItem.less');


module.exports = AbstractItem.extend({
    template: template,

    events: {
        'click .u-Remove': 'removeItem',
        'change .mdl-checkbox__input': 'checkCheck'
    },

    removeItem: function (e) {
        if (confirm('Delete card?')) {
            AbstractItem.prototype.removeItem.call(this, e);
        }
    },

    checkCheck: function (e) {
        var $input = $(e.target);
        this.model.set($input.attr('name'), $input[0].checked);

        // app.views.spinner.on();
        this.model.save(null, {
            complete: function (model) {
                // app.views.spinner.off();
                console.log('saved');
            }
        }, true);
    }
});
