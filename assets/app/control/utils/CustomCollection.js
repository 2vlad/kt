var _ = require('underscore/underscore.js');
var Backbone = require('backbone/backbone.js');


module.exports = Backbone.Collection.extend({
    comparator: 'order',

    syncCollection: function (success) {
        var notEmpty;

        // Если у коллекции есть проверка на пустые значения, выполнить эту проверку
        if ('checkEmpty' in this) {
            notEmpty = new this.constructor(this.reject(this.checkEmpty));
        } else {
            notEmpty = this;
        }

        return $.ajax({
            url: this.url,
            type: 'POST',
            data: JSON.stringify(notEmpty.toJSON()),
            success: success,
            error: function () {
                alert('Ошибка при сохранении');
            }
        });
    },

    isValid: function () {
        if (_.has(this.model.prototype, 'validate')) {
            // Если какая-то из моделей не валидна, отменить процесс сохранения
            if (!this.every(function (model) {
                return model.isValid();
            })) {
                return false;
            }
        }

        return true;
    }
});
