var _ = require('underscore/underscore.js');
var Backbone = require('backbone/backbone.js');

// require('jquery-ui/ui/widget.js');
// require('jquery-ui/ui/widgets/sortable.js');

module.exports = Backbone.View.extend({
    sortable: true,

    // Сохранять ли автоматически порядок сортировки
    autosave: false,

    events: {
        'click .u-Save': 'save',
        'click .u-ListAdd': 'addItem'
    },

    initialize: function (options) {
        this.options = options || {};
        this.sortable = (this.options.sortable !== undefined) ? this.options.sortable : this.sortable;
        this.autosave = (this.options.autosave !== undefined) ? this.options.autosave : this.autosave;
        this.maxItems = (this.options.maxItems !== undefined) ? this.options.maxItems : null;

        this._itemViews = [];

        this.$list = this.$('.u-List').add(this.$el.filter('.u-List'));
        this.$addItem = this.$('.u-ListAdd');
        this.$submit = this.$('.u-Save');
        this.$addButton = this.$('.u-addButton');

        if (this.sortable) {
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
                parent: this,
                viewType: 'item'
            });
        } else {
            view = new this.options.itemView(_.extend({
                model: model,
                parent: this
            }, {active: this.options.active}, this.options.itemAttributes));
        }

        var newEl = view.render().el;

        if (model.isNew()) {
            if (this.options.insertNew && this.options.insertNew === 'prepend') {
                if (this.$addButton.length) {
                    this.$addButton.after(newEl);
                } else {
                    this.$list.prepend(newEl);
                }
            } else {
                if (this.$addButton.length) {
                    this.$addButton.before(newEl);
                } else {
                    this.$list.append(newEl);
                }
            }
        } else {
            if (this.options.prependBeforeButton) {
                this.$addButton.before(newEl);
            } else {
                if (this.options.prepend) {
                    this.$list.prepend(newEl);
                } else {
                    this.$list.append(newEl);
                }
            }
        }

        this._itemViews.push(view);

        componentHandler.upgradeDom();

        view.afterAttach();

        if (model.isNew()) {
            this.updateSort(false);
        }
    },

    save: function (e) {
        if (e) {
            e.preventDefault();
        }
        var self = this;

        this.$submit.attr('disabled', 'disabled');
        // this.$submit.spin('standard');

        this.collection.syncCollection(function () {
            self.$submit.removeAttr('disabled');
            // self.$submit.spin(false);
            // app.views.spinner.off();

            if (!self.autosave) {
                window.location.reload();
            }
        });
    },

    addItem: function (e) {
        var $target = $(e.target);
        var $link = $target.closest('a');

        if ($link.length && $link.attr('href')) {
            return;
        }

        e.stopImmediatePropagation();

        var currentItems = this.collection.reject(function (model) {
            return model.get('removed') === true;
        });

        if (!this.maxItems || currentItems.length < this.maxItems) {
            this.collection.add(new this.collection.model());

            if (this.maxItems && (currentItems.length + 1 === this.maxItems)) {
                this.$addItem.hide();
            }
        }
    },

    initSortable: function () {
        var self = this;
        var config = {
            stop: function () {
                self.updateSort();
            },
            items: '> *:not(.u-NotSortable)'
        };

        if (this.options.handle) {
            config.handle = this.options.handle;
        }

        if (this.options.cancel) {
            config.cancel = this.options.cancel;
        }

        this.$list.sortable(config);
    },

    updateSort: function (save) {
        if (_.isUndefined(save)) {
            save = this.autosave;
        }

        var reverse = false;

        if (this.collection.comparator && this.collection.comparator[0] === '-') {
            reverse = true;
        }

        _.each(this._itemViews, function (view) {
            if (reverse) {
                view.model.set('order', this._itemViews.length - view.$el.index());
            } else {
                view.model.set('order', view.$el.index());
            }
        }, this);
        this.collection.sort();

        if (save) {
            this.trigger('sorted');
        }

        var currentItems = this.collection.reject(function (model) {
            return model.get('removed') === true;
        });

        if (this.maxItems && currentItems.length < this.maxItems) {
            this.$addItem.show();
        }
    }
});
