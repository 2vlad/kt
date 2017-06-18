var _ = require('underscore/underscore.js');
var Backbone = require('backbone/backbone.js');

var AbstractForm = require('control/components/AbstractForm/AbstractForm');
var AbstractList = require('control/components/AbstractList/AbstractList');

var Source = require('control/components/Source/Source');
var SourceModel = require('control/components/Source/SourceModel');
var SourceCollection = require('control/components/Source/SourceCollection');
var SourcePopup = require('control/components/SourcePopup/SourcePopup');

var template = require('./Card.jinja');
require('./Card.less');


module.exports = AbstractForm.extend({
    el: '.Card',

    template: template,

    events: {
        'click .GridAdd--programSource': 'addSource'
    },

    initialize: function (options) {
        AbstractForm.prototype.initialize.call(this, options);
    },

    render: function () {
        this.innerModel = this.model;
        this.$el.html(this.template.render({
            model: this.model.toJSON()
        }));

        this.form = new AbstractForm({
            el: this.$('.Form'),
            model: this.innerModel
        });

        this.sources = new AbstractList({
            el: this.$('.Card-sources'),
            itemView: Source,
            collection: this.model.get('program'),
            autosave: false,
            insertNew: 'append',
            prependBeforeButton: true
        });
        this.sources.render();

        this.sourcePopup = new SourcePopup({
            el: this.$('.SourcePopup'),
            editedCollection: this.model.get('program')
        });

        this.afterRender();

        return this;
    },

    addSource: function (e) {
        console.log('add btn pressed');
        e.preventDefault();

        var model = new SourceModel({
            order: this.model.get('program').length,
            card: app.data.card ? app.data.card.id : undefined
        });
        this.sourcePopup.open(model);
    }
});
