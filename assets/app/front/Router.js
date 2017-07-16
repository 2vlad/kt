var Backbone = require('backbone');
var _ = require('underscore');

var Index = require('front/pages/Index/Index');
var About = require('front/pages/About/About');
var NotFound = require('front/pages/NotFound/NotFound');
var CardPage = require('front/pages/CardPage/CardPage');

module.exports = Backbone.Router.extend({
    routes: {
        '': 'index',
        'about/': 'about',
        'cards/(:id/)': 'card'
    },

    index: function () {
        this.activate(Index);
    },

    card: function () {
        this.activate(CardPage);
    },

    about: function () {
        this.activate(About);
    },

    notFound: function () {
        this.activate(NotFound);
    },

    activate: function (view, params) {
        params = params || {};

        // вьюха отрендерена на сервере
        if (!app.state.view) {
            params.server = true;

            app.state.view = new view(params);
            // app.state.view.activate();

            return;
        }

        app.state.prevView = app.state.view;

        this.activateStandardLogic(view, params);
    },

    // активация перехода с полной перезагрузкой и лоадером
    activateStandardLogic: function (view, params) {
        var newParams = _.defaults({server: false, inAnimated: true}, params);
        var newView = new view(newParams);
        var duration = params.fastNavigate ? 0 : ANIMATION_DURATION;

        return Promise.all([app.state.view.playOut({
            duration: duration,
            zoom: params.zoomNavigate,
            view: newView
        }), newView.loadData()])
            .then(function () {
                app.els.$content.css({minHeight: app.els.$content.height()});

                return app.state.view.deactivate({destroy: true});
            })
            .then(function () {
                app.state.isServer = false;
                app.state.view = newView;
                app.state.view.activate(newParams)
                    .then(function () {
                        app.els.$content.css({minHeight: ''});
                        $(window).scrollTop(0);

                        return app.state.view.playIn({
                            duration: duration,
                            zoom: params.zoomNavigate, view: newView
                        });
                    });
            });

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
