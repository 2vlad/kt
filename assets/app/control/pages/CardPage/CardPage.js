var Backbone = require('backbone/backbone');
var _ = require('underscore/underscore');

var CardModel = require('control/components/Card/CardModel');
var Card = require('control/components/Card/Card');

require('./CardPage.less');

module.exports = Backbone.View.extend({
    el: '.CardPage',

    events: {
        'click .u-Save': 'save'
    },

    initialize: function () {
        this.model = new CardModel(app.data.card);

        this.$save = this.$('.u-Save');

        this.card = new Card({
            el: this.$('.Card-form'),
            model: this.model
            // program: app.data.program
        });
    },
    render: function () {
        this.card.render();
    },

    save: function (e) {
        e.preventDefault();
        var self = this;

        this.$save.attr('disabled', 'disabled');

        this.model.save(null, {
            success: function (model) {
                self.$save.removeAttr('disabled');

                window.location = window.location.pathname.replace('/new/', '/' + model.id + '/');

            },
            error: function () {
                alert('Ошибка при сохранении');
            }
        }, true);
    }
});

