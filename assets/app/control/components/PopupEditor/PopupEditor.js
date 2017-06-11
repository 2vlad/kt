require('./PopupEditor.less');

module.exports = Backbone.View.extend({
    events: {
        'click .cpApply': 'apply',
        'click .cpClose': 'close'
    },

    initialize: function (options) {
        this.$apply = $('.cpApply', this.$el);
    },

    apply: function () {
        this.hidePopup();
    },

    close: function () {
        this.hidePopup();
    },

    show: function () {
        this.$el.show();
        $('body').addClass('with-popup');
    },

    hidePopup: function () {
        this.$el.hide();
        if (!$('.cPopup:visible').length) {
            $('body').removeClass('with-popup');
        }
    }
});
