var Backbone = require('backbone');

require('./CardResource.less');

module.exports = Backbone.View.extend({

    el: '.CardResource',

    initialize: function () {

        var num = $('.CardResource-num');
        var card = $('.Card2-resourcesContainer');

        for (i = 0; i < num.length; i++) {

            $(card[i]).find('.CardResource-num')
                .each(function (item) {
                    $(this).html((item + 1) + '.');
                });
        }
    }
});
