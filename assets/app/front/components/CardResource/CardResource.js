var Backbone = require('backbone');

require('./CardResource.less');

module.exports = Backbone.View.extend({

    el: '.CardResource',

    initialize: function () {

        var type = $('.CardResource-typeOfResource');

        for (i = 1; i < type.length; i++) {
            if ($(type[i - 1]).html() == $(type[i]).html()) {
                $(type[i]).css('color', 'rgba(0, 0, 0, 0)');
            }
        }
    }
});
