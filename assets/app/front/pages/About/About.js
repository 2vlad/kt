var Backbone = require('backbone/backbone');

require('./About.less');

module.exports = Backbone.View.extend({

    el: 'body',

    initialize: function () {

        // imageArray = [
        //     '/static/img/head_1.png',
        //     '/static/img/head_2.png',
        //     '/static/img/head_3.png'
        // ];
        //
        // random = Math.ceil(Math.random() * 3);
        //
        // $('.Nav').css('background-image', 'url(' + imageArray[random - 1] + ')');

    }
});
