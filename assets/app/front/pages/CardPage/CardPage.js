var Backbone = require('backbone');

var Base = require('front/components/Base/Base');
var Card2 = require('front/components/Card2/Card2');
var Nav = require('front/components/Nav/Nav');
var Footer = require('front/components/Footer/Footer');
var About = require('front/pages/About/About');

require('./CardPage.less');

module.exports = Base.extend({
    el: '.CardPage',

    initialize: function () {

        this.nav = new Nav();
        this.card2 = new Card2();

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
