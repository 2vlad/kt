var Backbone = require('backbone/backbone.js');

var Source = require('control/components/Source/SourceCollection');
var SourceCollection = require('control/components/Source/SourceCollection');

module.exports = Backbone.Model.extend({
    urlRoot: '/control/api/cards/',

    initialize: function () {
        this.set('program', new SourceCollection(this.get('program')));
    }
});
