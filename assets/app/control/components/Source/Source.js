var _ = require('underscore/underscore');

var AbstractItem = require('control/components/AbstractItem/AbstractItem');

require('./Source.less');
var template = require('./Source.jinja');


module.exports = AbstractItem.extend({
    template: template,

    events: function () {
        return _.extend({}, AbstractItem.prototype.events, {
            'click .Source-anchor': 'openEditor',
            'change input[name=isFree]': 'change'
        });
    },

    change: function (e) {
        var $input = $(e.target);
        this.model.set($input.attr('name'), $input[0].checked);

        // app.views.spinner.on();
        this.model.save(null, {
            complete: function (model) {
                // app.views.spinner.off();
            }
        }, true);
    },

    openEditor: function () {
        window.app.router.control.view.card.sourcePopup.open(this.model);
        // window.app.router.view.personPopup.open(this.model);
    }
});

