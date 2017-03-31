var Backbone = require('backbone/backbone.js');

module.exports = Backbone.View.extend({
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
        this.$el.html();

        this.setElement($(this.template.render({
            model: this.model.toJSON(),
            cid: this.model.cid
        })));

        return this;
    },

    afterAttach: function () {
    },

    removeItem: function (e) {
        e.preventDefault();

        e.stopImmediatePropagation();

        this.$el.remove();
        this.unbind();
        this.stopListening();

        if (!this.model.isNew()) {
            this.model.set('removed', true);
        } else {
            this.options.parent.collection.remove(this.model);
        }
        this.options.parent.updateSort();
    }
});
