var PopupEditorView = require('control/components/PopupEditor/PopupEditor');

var styles = require('./LinkPopupEditor.less');
var template = require('./LinkPopupEditor.jinja');

module.exports = PopupEditorView.extend({
    template: template,

    events: {
        'click .cpApply': 'apply',
        'change #linkEditor': 'change',
        'click .cpClose': 'close'
    },

    initialize: function (options) {
        var self = this;
        var $body = $('body');
        $body.append(this.template.render());
        this.setElement($body.find('.linkPopup'));

        PopupEditorView.prototype.initialize.apply(this, [options]);

        this.$input = $('input[type=text]', this.$el);

        this.$input.on('propertychange paste drop dragend dragover dragenter change keypress keydown', function (e) {
            setTimeout(function () {
                self.change();
            }, 100);
        });

        componentHandler.upgradeDom();
    },

    apply: function () {
        var url = this.$input.val();
        if ((url.indexOf('http://') == -1) && (url.indexOf('https://') == -1)) {
            url = 'http://' + url;
        }
        this.callbacks.success(this.editor, url);
        PopupEditorView.prototype.apply.apply(this);
    },

    close: function () {
        this.callbacks.cancel();
        PopupEditorView.prototype.close.apply(this);
    },

    change: function () {
        var value = this.$input.val();

        if (value && this.isValidUrl(value)) {
            this.$apply.removeAttr('disabled');
        } else {
            this.$apply.attr('disabled', 'disabled');
        }
    },

    /* eslint-disable max-params */
    showOn: function (ckEditor, callbacks, url) {
        this.show();
        this.editor = ckEditor;
        this.callbacks = callbacks;
        if (url !== undefined) {
            this.$input.val(url);
        } else {
            this.$input.val('');
        }
        this.$input.trigger('change').focus();
    },
    /* eslint-enable max-params */

    isValidUrl: function (value) {
        var url = value;
        var re = /^((https?|ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

        return re.test(url);
    }
});
