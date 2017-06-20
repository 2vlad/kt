var Backbone = require('backbone');

require('./Card2.less');

var CardResource = require('front/components/CardResource/CardResource');

module.exports = Backbone.View.extend({

    el: 'body',

    initialize: function () {

        this.cardResource = new CardResource();

        // var bgUnit = $('.Card2-backgroundUnit');
        //
        // console.log(bgUnit.length);
        // for (i = 0; i < bgUnit.length - 1; i++) {
        //     var value = $(bgUnit[i]).html();
        //     console.log(value);
        //     $(bgUnit[i]).text(value + ', ');
        // }
    }
});
