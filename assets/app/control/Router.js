var Backbone = require('backbone');
var _ = require('underscore');

// var Index = require('control/pages/Index/Index');
var AboutPage = require('control/pages/AboutPage/AboutPage');
var NotFound = require('control/pages/NotFound/NotFound');
var FieldListPage = require('control/pages/FieldListPage/FieldListPage');


module.exports = Backbone.Router.extend({
    routes: {
        'control/': 'fieldListPage',
        'control/about/': 'aboutPage'
    },

    fieldListPage: function () {
        this.activate(FieldListPage);
    },

    // index: function () {
    //     this.activate(Index);
    // },

    aboutPage: function () {
        this.activate(AboutPage);
    },

    notFound: function () {
        this.activate(NotFound);
    },

    activate: function (view, params) {
        this.view = new view(params);
        this.view.render();
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
