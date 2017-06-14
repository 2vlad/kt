var _ = require('underscore');
var Backbone = require('backbone');

var defaultOptions;

require('jquery-ui/ui/widgets/sortable');
// require('jquery-ui/sortable');

/*
 * Абстрактный список
 * Элементом списка может быть любой компонент.
 * С помощью него можно сортировать, добавлять и удалять элементы.
 *
 * Параметры компоненты:
 * sortable: true | false
 * Включена ли сортировка списка с помощью drag'n'drop
 *
 *
 * */
defaultOptions = {
    sortable: true
};

module.exports = Backbone.View.extend({
    // Сохранять ли автоматически порядок сортировки
    autosave: false,

    events: {
        'click .btn-save': 'save',
        'click .u-ListAdd': 'addItem'
    },

    initialize: function (options) {
        this.options = _.extend(defaultOptions, options);

        this.autosave = (this.options.autosave !== undefined) ? this.options.autosave : this.autosave;
        this.maxItems = (this.options.maxItems !== undefined) ? this.options.maxItems : null;

        this._itemViews = [];

        this.$list = this.$('.u-List').add(this.$el.filter('.u-List'));
        this.$addItem = this.$('.u-Add');
        this.$submit = this.$('.btn-save');

        if (this.options.sortable) {
            this.initSortable();
        }

        if (this.autosave) {
            //this.$loader = $('.b-loader');
            this.on('sorted', this.save, this);
        }

        if (this.maxItems && this.collection.length === this.maxItems) {
            this.$addItem.hide();
        }

        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.renderElement);
    },

    render: function () {
        this.$list.children().not('.u-NoRemove')
            .remove();
        this._itemViews = [];

        this.collection.each(function (model) {
            this.renderElement(model);
        }, this);
    },

    renderElement: function (model) {
        var view;
        var viewType;

        if (model.has('itemType')) {
            viewType = this.options.itemViews[model.get('itemType')];
            view = new viewType({
                model: model,
                parent: this
            });
        } else {
            view = new this.options.itemView(_.extend({
                model: model,
                parent: this
            }, {active: this.options.active}, this.options.itemAttributes));
        }

        if (this.options.prepend) {
            this.$addItem.before(view.render().el);
        } else {
            this.$list.append(view.render().el);
        }

        this._itemViews.push(view);

        componentHandler.upgradeDom();

        view.afterAttach();

        if (model.isNew()) {
            this.updateSort();
        }
    },

    save: function (e) {
        if (e) {
            e.preventDefault();
        }

        this.$submit.attr('disabled', 'disabled');
        this.$submit.spin('standard');

        this.collection.syncCollection(function () {
            this.$submit.removeAttr('disabled');
            this.$submit.spin(false);
            if (!this.autosave) {
                window.location.reload();
            }
        }.bind(this));
    },

    addItem: function (e) {
        var $target = $(e.target);
        var $link = $target.closest('a');
        var currentItems;

        if ($link.length && $link.attr('href')) {
            return;
        }

        e.stopImmediatePropagation();

        currentItems = this.collection.reject(function (model) {
            return model.get('removed') === true;
        });

        if (!this.maxItems || currentItems.length < this.maxItems) {
            this.collection.add(new this.collection.model());

            if (this.maxItems && (currentItems.length + 1 === this.maxItems)) {
                this.$addItem.hide();
            }
        }
    },

    // подключение jQuery sortable к списку для сортировки drag'n'drop
    initSortable: function () {
        // настройка конфига jQuery sortable
        var config = {
            stop: function () {
                this.updateSort();
            }.bind(this)
        };

        if (this.options.handle) {
            config.handle = this.options.handle;
        }

        if (this.options.cancel) {
            config.cancel = this.options.cancel;
        }

        this.$list.sortable(config);
    },

    // метод для проставления новых индексов в элементах после завершения сортировки
    updateSort: function (save) {
        var currentItems;

        if (_.isUndefined(save)) {
            save = this.autosave;
        }

        _.each(this._itemViews, function (view) {
            view.model.set('order', view.$el.index());
        });
        this.collection.sort();

        if (save) {
            this.trigger('sorted');
        }

        currentItems = this.collection.reject(function (model) {
            return model.get('removed') === true;
        });

        if (this.maxItems && currentItems.length < this.maxItems) {
            this.$addItem.show();
        }
    }
});
