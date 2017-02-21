var Backbone = require('backbone');

var template = require('./Button.jinja');
require('./Button.less');

module.exports = Backbone.View.extend({
    render: function () {
        var $html = $(template.render());
        this.setElement($html);

        return this;
    }
});
