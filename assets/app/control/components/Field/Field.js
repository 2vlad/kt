var AbstractForm = require('control/components/AbstractForm/AbstractForm');

var template = require('./Field.jinja');
require('./Field.less');


module.exports = AbstractForm.extend({
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
