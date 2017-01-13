var Backbone = require('backbone/backbone');
var _ = require('underscore/underscore');

var Index = require('front/pages/Index/Index');

module.exports = Backbone.Router.extend({
    routes: {
        '': 'index'
    },

    index: function () {
        this.activate(Index);
    },

    activate: function (view, params) {
        this.view = new view(params);
    },

    start: function () {
        var pushStateSupported = history && _.isFunction(history.pushState);
        Backbone.history.start({pushState: pushStateSupported});
    }
});
