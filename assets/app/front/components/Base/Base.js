var Backbone = require('backbone');
var _ = require('underscore');
var Utils = require('front/utils/Utils');

// Базовый компонент, на основе которого делаем все остальные
// Умеет рендерить себя и управлять подкомпонентами
module.exports = Backbone.View.extend(_.extend({}, Backbone.Events, {
    initialize: function (options) {
        this.options = options || {};

        // Хранилище подкомпонент которыми упраляет данный компонент
        this.views = {};

        if (this.options.server === false) {
            this.setElement($(''));
        }
    },

    isRendered: function () {
        return !!this.$el.length;
    },

    $parent: function () {
        return null;
    },

    attach: function () {
        var $parent = this.$parent();
        if ($parent) $parent.append(this.$el);
    },

    renderData: function () {
        return this.data || {};
    },

    render: function () {
        var data = this.renderData();
        data.viewOptions = this.options;

        this.setElement(this.template.render(data));
        this.attach();

        return this;
    },

    activate: function () {
        return this.loadData()
            .then(function () {
                if (!this.isRendered() || this.$el.parents('html').length == 0) {
                    this.render();
                }
                this.viewsRegistration();
            }.bind(this))
            .then(function () {
                // Активация подвьюх
                var promise = Utils.createEmptyPromise();

                if (this.views) {
                    promise = Promise.all(_.map(this.views, function (view) {
                        return view.activate();
                    }));
                }

                return promise;
            }.bind(this));
    },

    deactivate: function (params) {
        var promise = Utils.createEmptyPromise();

        if (this.views) {
            promise = Promise.all(_.map(this.views, function (view) {
                return view.deactivate(params);
            }));
        }

        return promise.then(function () {
            if (params.destroy) {
                this.destroy();
            }
        }.bind(this));
    },

    destroy: function () {
        this.undelegateEvents();
        this.$el.removeData().unbind();
        this.remove();
    },

    viewsRegistration: function () {
    },

    registerView: function (viewName, view) {
        view.parent = this;
        this.views[viewName] = view;

        return view;
    },

    addView: function (view) {
        this.views.push(view);
    },

    getView: function (viewName) {
        return this.views[viewName];
    },

    destroyView: function (viewName) {
        this.views[viewName].destroy();
        delete this.views[viewName];
    },

    forceLoadData: function (apiUrl) {
        var api;
        apiUrl = apiUrl || this.apiUrl;

        if (apiUrl) {
            api = _.isFunction(apiUrl) ? apiUrl() : apiUrl;

            return Promise.resolve($.getJSON(api)
                .then(function (data) {
                    this.data = data;
                }.bind(this))
                .fail(function () {
                    console.log('Ошибка при загрузке данных.');
                }));
        } else {
            return Utils.createEmptyPromise();
        }
    },

    loadData: function () {
        if (!this.data) {
            if (!this.disableCache) {
                //Если не запрещено кеширование, то кешим и выдаем
                if (window.app.cache[this.apiUrl] !== undefined) {
                    this.data = window.app.cache[this.apiUrl];

                    return Utils.createEmptyPromise();
                }

                return this.forceLoadData(this.apiUrl)
                    .then(function () {
                        window.app.cache[this.apiUrl] = this.data;
                    }.bind(this));
            } else {
                return this.forceLoadData(this.apiUrl);
            }
        } else {
            return Utils.createEmptyPromise();
        }
    },

    // Метод для вставки логики анимации при активации компоненты
    playIn: function () {
        // Возврат пустого Promise, означает что метод считается выполненым
        return Utils.createEmptyPromise();
    },

    // Метод для вставки логики анимации при деактивации компоненты
    playOut: function () {
        // Возврат пустого Promise, означает что метод считается выполненым
        return Utils.createEmptyPromise();
    }
}));
