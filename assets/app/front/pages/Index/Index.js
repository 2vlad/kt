var Backbone = require('backbone');

var Base = require('front/components/Base/Base');
var Button = require('front/components/Button/Button');

require('./Index.less');

module.exports = Base.extend({
    el: '.Index',

    initialize: function () {
        this.button = new Button();
        this.$('.Index-button').html(this.button.render().el);
    }
});
