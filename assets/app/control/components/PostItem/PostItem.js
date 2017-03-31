var Item = require('control/components/Item/Item');

var template = require('./PostItem.jinja');
require('./PostItem.less');

module.exports = Item.extend({
    template: template
});
