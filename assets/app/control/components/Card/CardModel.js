var Backbone = require('backbone/backbone.js');

var Source = require('control/components/Source/SourceCollection');

module.exports = Backbone.Model.extend({
    urlRoot: '/control/api/cards/',

    initialize: function () {
        this.set('program', new Source(this.get('program')));
    }
});
