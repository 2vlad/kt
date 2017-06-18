var _ = require('underscore/underscore.js');
var Backbone = require('backbone/backbone.js');

var BtnRemove = require('control/components/BtnRemove/BtnRemove');
var AbstractItem = require('control/components/AbstractItem/AbstractItem');

var template = require('./GridItemCall.jinja');
require('./GridItem.less');

module.exports = AbstractItem.extend({
    tagName: 'li',

    template: template
});
