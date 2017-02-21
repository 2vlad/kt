var Backbone = require('backbone/backbone');
var _ = require('underscore/underscore');

var Index = require('front/pages/Index/Index');
var NotFound = require('front/pages/NotFound/NotFound');

module.exports = Backbone.Router.extend({
    routes: {
        '': 'index'
    },

    index: function () {
        this.activate(Index);
    },

    notFound: function () {
        this.activate(NotFound);
    },

    activate: function (view, params) {
        this.view = new view(params);
    },

    start: function () {
        var is404 = app.els.$body.hasClass('Page404');
        var pushStateSupported = history && _.isFunction(history.pushState);
        Backbone.history.start({pushState: pushStateSupported, silent: is404});

        if (is404) {
            this.notFound();
        }
    }
});
