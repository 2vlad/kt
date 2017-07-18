var Backbone = require('backbone');

require('./Card2.less');

var CardResource = require('front/components/CardResource/CardResource');

module.exports = Backbone.View.extend({

    el: '.Card2',

    events: {
        'click .Card2-shareWrap': 'showMessage'
    },

    initialize: function () {

        this.cardResource = new CardResource();
        new Clipboard('.btn');

    },

    showMessage: function (e) {
        var messageBox = $(e.target).parent().parent().siblings();
        messageBox
            .addClass('Card2-shareMessageBox--toShow');
        setTimeout(function () {
            messageBox.removeClass('Card2-shareMessageBox--toShow');
        }, 1500);
    }
});
