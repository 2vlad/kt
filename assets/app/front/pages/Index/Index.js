var Backbone = require('backbone');

var Base = require('front/components/Base/Base');
var Button = require('front/components/Button/Button');
var Card2 = require('front/components/Card2/Card2');
var Nav = require('front/components/Nav/Nav');
var Footer = require('front/components/Footer/Footer');
var About = require('front/pages/About/About');

require('./Index.less');

module.exports = Base.extend({
    el: 'body',

    events: {
        'click .Nav-about': 'showPopup',
        'click .Nav-info': 'showPopup',
        'click .Index-cross': 'closePopup',
        'click .Index-layer': 'closePopup'
    },

    initialize: function () {
        this.card2 = new Card2();
        this.nav = new Nav();
        this.button = new Button();
        this.footer = new Footer();
        this.about = new About();
        this.$('.Index-button').html(this.button.render().el);

        var numOfCards = $('.Card2').length;


        // Write on keyup event of keyword input element
        $('#search').keyup(function () {
            _this = this;
            // Show only matching TR, hide rest of them
            $.each($('.Card2'), function () {
                if ($(this)
                        .text()
                        .toLowerCase()
                        .indexOf($(_this)
                            .val()
                            .toLowerCase()) === -1) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
            for (i = 0; i < numOfCards; i++) {
                var anyCardShown = $('.Card2').filter(function () {
                        return $(this).css('display') === 'block';
                    }).length > 0;

                if (!anyCardShown) {
                    $('.SetOfCards-nothingFound').show();
                } else {
                    $('.SetOfCards-nothingFound').hide();
                }
            }
        });
    },

    showPopup: function (e) {
        e.preventDefault();

        $('.Index-popup').addClass('Index-popup--toShow');
        $('.Index-layer').addClass('Index-layer--toShow');
        $('body').css({
            'overflow-x': 'hidden',
            'overflow-y': 'hidden'
        });
    },

    closePopup: function (e) {
        e.preventDefault();

        $('.Index-popup').removeClass('Index-popup--toShow');
        $('.Index-layer').removeClass('Index-layer--toShow');
        $('body').css({
            'overflow-x': 'hidden',
            'overflow-y': 'auto'
        });
    }
});
