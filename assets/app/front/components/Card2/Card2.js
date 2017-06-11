var Backbone = require('backbone');

require('./Card2.less');

var CardResource = require('front/components/CardResource/CardResource');

module.exports = Backbone.View.extend({

    el: 'body',

    initialize: function () {

        this.cardResource = new CardResource();

    }
});
