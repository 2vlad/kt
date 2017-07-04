require('./Nav.less');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

    el: '.Nav',

    initialize: function () {

        imageArray = [
            '/static/img/head_1.png',
            '/static/img/head_2.png',
            '/static/img/head_3.png'
        ];

        random = Math.ceil(Math.random() * 3);

        $('.Nav').css('background-image', 'url(' + imageArray[random - 1] + ')');
    }
});
