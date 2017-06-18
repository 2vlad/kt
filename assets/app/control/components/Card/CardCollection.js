var CustomCollection = require('control/utils/CustomCollection');
var CardModel = require('./CardModel');


module.exports = CustomCollection.extend({
    url: '/control/api/cards/',

    model: CardModel
});
