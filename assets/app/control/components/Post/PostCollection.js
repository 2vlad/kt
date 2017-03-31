var Backbone = require('backbone');

var Collection = require('control/components/Collection/Collection');
var PostModel = require('./PostModel');

module.exports = Collection.extend({
    url: '/control/api/posts/',

    model: PostModel
});
