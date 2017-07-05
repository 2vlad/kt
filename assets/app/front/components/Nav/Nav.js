require('./Nav.less');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

    el: 'body',

    initialize: function () {

        storyArray = [
            'story-1',
            'story-2',
            'story-3',
            'story-4',
            'story-5',
            'story-6'
        ];

        random = Math.ceil(Math.random() * 6);

        $('.Nav').addClass(storyArray[random - 1]);
    }
});
