var Backbone = require('backbone/backbone');

var AbstractList = require('control/components/AbstractList/AbstractList');
var Card = require('control/components/Card/Card');
var CardItem = require('control/components/CardItem/CardItem');
var CardItemList = require('control/components/CardItemList/CardItemList');
var CardCollection = require('control/components/Card/CardCollection');

require('./CardListPage.less');


module.exports = Backbone.View.extend({
    el: 'body',

    initialize: function () {
        this.cardCollection = new CardCollection(app.data.cardList);

        this.cardList = new AbstractList({
            el: this.$('.CardItemList'),
            collection: this.cardCollection,
            autosave: true,
            sortable: true,
            itemView: CardItem
        });
    },

    render: function () {
        this.cardList.render();

        $('.CardItem-subtitle')
            .each(function (item) {
                if ($(this).text().length > 30) {
                    var str = $(this).text();
                    str = str.substr(0, 30);
                    $(this).text(str + '...');
                }
            });
    }
});
