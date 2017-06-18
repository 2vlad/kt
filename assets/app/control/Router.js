var Backbone = require('backbone');
var _ = require('underscore');

var AboutPage = require('control/pages/AboutPage/AboutPage');
var NotFound = require('control/pages/NotFound/NotFound');
var CardPage = require('control/pages/CardPage/CardPage');
var CardListPage = require('control/pages/CardListPage/CardListPage');

module.exports = Backbone.Router.extend({
    routes: {
        'control/': 'cardListPage',
        'control/cards/(:id/)': 'cardPage',
        'control/about/': 'aboutPage'
    },

    cardListPage: function () {
        this.activate(CardListPage);
    },

    cardPage: function () {
        this.activate(CardPage);
    },

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
