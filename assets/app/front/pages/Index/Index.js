var Backbone = require('backbone');

var Base = require('front/components/Base/Base');
var Button = require('front/components/Button/Button');
var Card2 = require('front/components/Card2/Card2');

require('./Index.less');

module.exports = Base.extend({
    el: '.Index',

    initialize: function () {
        this.card2 = new Card2();
        this.button = new Button();
        this.$('.Index-button').html(this.button.render().el);

        // Write on keyup event of keyword input element
        $('#search').keyup(function () {
            _this = this;
            // Show only matching TR, hide rest of them
            $.each($('.Card2'), function () {
                if ($(this).text().toLowerCase().indexOf($(this).val().toLowerCase()) == -1) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        });
    }
});
