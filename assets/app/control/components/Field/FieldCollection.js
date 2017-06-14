var CustomCollection = require('control/utils/CustomCollection');
var FieldModel = require('./FieldModel');


module.exports = CustomCollection.extend({
    url: '/control/api/fields/',

    model: FieldModel
});
