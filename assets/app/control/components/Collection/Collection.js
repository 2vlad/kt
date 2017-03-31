var _ = require('underscore');
var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
    comparator: 'order',

    syncCollection: function (success) {
        return $.ajax({
            url: this.url,
            type: 'POST',
            data: JSON.stringify(notEmpty.toJSON()),
            success: success
        });
    }
});
