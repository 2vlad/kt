require('./Nav.less');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

    el: 'body',

    initialize: function () {
        random = Math.ceil(Math.random() * 22) - 1;

        // $('.Nav').addClass('story-' + random);
        $('.Nav').addClass('story-5');
    }
});
