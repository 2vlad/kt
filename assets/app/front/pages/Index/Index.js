var Backbone = require('backbone');

var Button = require('front/components/Button/Button');

require('./Index.less');

module.exports = Backbone.View.extend({
    el: '.Index',

    initialize: function () {
        this.button = new Button();
        this.$('.Index-button').html(this.button.render().el);
    }
});
