var _ = require('underscore/underscore.js');

var AbstractForm = require('control/components/AbstractForm/AbstractForm');
var AbstractPopup = require('control/components/AbstractPopup/AbstractPopup');

var template = require('./SourcePopup.jinja');
require('./SourcePopup.less');


module.exports = AbstractPopup.extend({
    template: template,

    className: 'SourcePopup',

    events: {
        'click .AbstractPopup-close': 'close',
        'click .AbstractPopup-save': 'save',
        'change input, textarea': 'change',
        'submit form': 'save'
    },

    render: function () {
        this.$el.html(this.template.render({model: this.model.toJSON()}));

        this.$submit = this.$('.Submit').find('button');

        this.form = new AbstractForm({
            el: this.$('.Form'),
            model: this.model
        });

        this.form.afterRender();

        return this;
    },

    save: function () {
        this.options.editedCollection.add(this.model);
        this.close();
    }
});
