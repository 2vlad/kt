var Backbone = require('backbone/backbone');

var AbstractList = require('control/components/AbstractList/AbstractList');
var FieldItem = require('control/components/FieldItem/FieldItem');
var FieldItemList = require('control/components/FieldItemList/FieldItemList');
var FieldCollection = require('control/components/Field/FieldCollection');
var Field = require('control/components/Field/Field');
var FieldModel = require('control/components/Field/FieldModel');

require('./FieldListPage.less');

module.exports = Backbone.View.extend({
    el: 'body',

    events: {
        'click .u-Save': 'save'
    },

    initialize: function () {
        this.FieldCollection = new FieldCollection(app.data.fieldList);

        this.fieldList = new AbstractList({
            el: this.$('.FieldItemList'),
            collection: this.FieldCollection,
            autosave: true,
            sortable: true,
            itemView: FieldItem
        });

        this.model = new FieldModel(app.data.field);

        this.$save = this.$('.u-Save');

        this.field = new Field({
            el: this.$('.Field-form'),
            model: this.model,
            field: app.data.field
        });
    },

    render: function () {
        this.fieldList.render();
        this.field.render();
    },

    save: function (e) {
        e.preventDefault();
        var self = this;

        this.$save.attr('disabled', 'disabled');

        this.model.save(null, {
            success: function () {
                self.$save.removeAttr('disabled');
                window.location.reload();
            },
            error: function () {
                alert('Ошибка при сохранении');
            }
        }, true);
    }
});
