var Backbone = require('backbone/backbone.js');

//var utils = require('control/utils/Capitalize.js');

module.exports = Backbone.View.extend({
    tagName: 'li',

    itemName: 'этот объект',

    events: {
        'click .u-Remove': 'removeItem'
    },

    initialize: function (options) {
        this.options = options || {};
        if (this.options.itemName) {
            this.itemName = this.options.itemName;
        }
    },

    render: function () {
        var data;
        var parentModel;

        this.$el.html();

        if (this.options.viewType === 'item') {
            data = this.model.toJSON().item;
            parentModel = this.model.toJSON();
        } else {
            data = this.model.toJSON();
            parentModel = null;
        }

        var $html = $(this.template.render({
            model: data,
            parentModel: parentModel,
            cid: this.model.cid
        }));

        this.setElement($html);

        return this;
    },

    afterAttach: function () {
    },

    removeItem: function (e) {
        e.preventDefault();

        e.stopImmediatePropagation();

        if (this.options.parent.options.autosave) {
            // app.views.spinner.on();
            this.model.destroy({
                success: function () {
                    // app.views.spinner.off();
                }
            });
        } else {
            if (!this.model.isNew()) {
                this.model.set('removed', true);
            } else {
                this.options.parent.collection.remove(this.model);
            }

            this.options.parent.updateSort();
        }

        this.$el.remove();
        this.unbind();
        this.stopListening();
    }
});
