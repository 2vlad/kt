var Backbone = require('backbone');

require('./CardResource.less');

module.exports = Backbone.View.extend({

    el: '.CardResource',

    initialize: function () {

        var num = $('.CardResource-num');

        for (i = 0; i < num.length; i++) {
            $(num[i]).html((i + 1) + '.');
        }

        // var type = $('.CardResource-typeOfResource');
        // var resource = $('.CardResource');
        //
        // for (i = 1; i < type.length; i++) {
        //     if ($(type[i - 1]).html() == $(type[i]).html()) {
        //         $(type[i]).css('color', 'rgba(0, 0, 0, 0)');
        //     } else {
        //         $(resource[i]).css('padding', '18px 0 18px 0');
        //     }
        // }
    }
});
