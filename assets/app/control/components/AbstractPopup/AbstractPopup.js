var _ = require('underscore/underscore.js');
var Backbone = require('backbone/backbone.js');

module.exports = Backbone.View.extend({
    events: {
        'click .AbstractPopup-close': 'close',
        'click .AbstractPopup-save': 'save',
        'change input, textarea': 'change'
    },

    initialize: function (options) {
        this.options = options || {};
    },

    render: function () {
        this.$el.html(this.template());
    },

    open: function (model) {
        this.model = model;
        this.show();

        this.$submit = this.$('.AbstractPopup-save').find('button');
    },

    show: function () {
        this.$el.css('display', 'flex');
        $('body').css('overflow-y', 'hidden');
        this.render();
        componentHandler.upgradeDom();
    },

    close: function (e) {
        if (e) {
            e.preventDefault();
        }
        $('body').css('overflow-y', 'visible');
        this.$el.hide();
    },

    change: function (e) {
        var $input = $(e.target);
        this.model.set($input.attr('name'), $input.val());
    },

    save: function () {
        var self = this;

        if (this.model.isValid()) {
            this.$submit.attr('disabled', 'disabled');
            this.$submit.spin('standard');

            var reverse = false;

            if (self.options.editedCollection.comparator && self.options.editedCollection.comparator[0] === '-') {
                reverse = true;
            }

            this.model.save(null, {
                success: function (model) {
                    self.$submit.removeAttr('disabled');
                    self.$submit.spin(false);
                    if (!self.options.editedCollection.findWhere({id: model.id})) {
                        if (reverse) {
                            self.options.editedCollection.unshift(model);
                        } else {
                            self.options.editedCollection.add(model);
                        }
                    }
                    self.options.editedCollection.reset(self.options.editedCollection.toJSON());
                    self.close();
                },
                error: function () {
                    alert('Ошибка при сохранении');
                }
            }, true);
        }
    }
});
