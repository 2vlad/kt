var Backbone = require('backbone/backbone');

require('./About.less');
var Nav = require('front/components/Nav/Nav');

module.exports = Backbone.View.extend({

    el: 'body',

    initialize: function () {
        this.nav = new Nav();
    }
});
