var Backbone = require('backbone/backbone');
var _ = require('underscore/underscore');

var AboutModel = require('control/components/About/AboutModel');
var About = require('control/components/About/About');

require('./AboutPage.less');

module.exports = Backbone.View.extend({
    el: '.AboutPage',

    events: {
        'click .u-Save': 'save'
    },

    initialize: function () {
        this.model = new AboutModel(app.data.about);

        this.$save = this.$('.u-Save');

        this.about = new About({
            el: this.$('.AboutPage-form'),
            model: this.model
        });
    },

    render: function () {
        this.about.render();
    },

    save: function (e) {
        e.preventDefault();
        var self = this;

        this.$save.attr('disabled', 'disabled');
        // this.$save.spin('standard');
        //
        this.model.save(null, {
            success: function (model) {
                self.$save.removeAttr('disabled');
                // self.$save.spin(false);
                window.location.reload();
            },
            error: function () {
                alert('Ошибка при сохранении');
            }
        }, true);
    }
});

