var Backbone = require('backbone');

var List = require('control/components/List/List');
var PostItem = require('control/components/PostItem/PostItem');
var PostCollection = require('control/components/Post/PostCollection');

require('./PostList.less');

module.exports = Backbone.View.extend({
    el: '.PostList',

    initialize: function () {
        this.postList = new List({
            el: this.$('.PostList-list'),
            itemView: PostItem,
            collection: new PostCollection(app.data.postList)
        });
    },

    render: function () {
        this.postList.render();
    }
});
