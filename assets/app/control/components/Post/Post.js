var Backbone = require('backbone');

var template = require('./Post.jinja');
require('./Post.less');

module.exports = Backbone.View.extend({
    template: template
});
