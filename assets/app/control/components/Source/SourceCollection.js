var CustomCollection = require('control/utils/CustomCollection');
var SourceModel = require('./SourceModel');

module.exports = CustomCollection.extend({
    url: '/control/api/sources/',

    model: SourceModel,

    comparator: 'order'
});
