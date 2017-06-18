var AbstractForm = require('control/components/AbstractForm/AbstractForm');

var template = require('./Card.jinja');
require('./Card.less');


module.exports = AbstractForm.extend({
    el: '.Card',

    template: template,

    initialize: function (options) {
        AbstractForm.prototype.initialize.call(this, options);
    },

    render: function () {
        this.$el.html(this.template.render({
            model: this.model.toJSON()
        }));

        this.afterRender();

        return this;
    }
});
