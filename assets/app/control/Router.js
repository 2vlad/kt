var Backbone = require('backbone');
var _ = require('underscore');

var Index = require('control/pages/Index/Index');
var PostList = require('control/pages/PostList/PostList');
var NotFound = require('control/pages/NotFound/NotFound');

module.exports = Backbone.Router.extend({
    routes: {
        '': 'index'
    },

    index: function () {
        this.activate(Index);
    },

    postList: function () {
        this.activate(PostList);
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
