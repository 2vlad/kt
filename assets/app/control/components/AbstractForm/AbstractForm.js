var Backbone = require('backbone/backbone.js');
var _ = require('underscore/underscore.js');
require('jquery.my_addition.js');

var LinkPopupEditor = require('control/components/LinkPopupEditor/LinkPopupEditor');
// var CONFIG_IMAGE = require('ckeditor/config_image.js');
// var CONFIG_LIST = require('ckeditor/config_list.js');
// var CONFIG_TABLE = require('ckeditor/config_table.js');

module.exports = Backbone.View.extend({
    events: {
        'change input': 'change',
        'change textarea': 'change',
        'change select': 'change',
        'click .save': 'save'
    },

    initialize: function (options) {
        _.bindAll(this, 'ckChange', 'ckFocus', 'ckBlur');

        this.options = options || {};
    },

    afterRender: function () {
        this.$textarea = this.$('.Textarea-text');
        this.$length = $('.linkPopup').length;

        if (this.$textarea.length) {

            if (this.$length < 1) {
                app.router.linkEditor = new LinkPopupEditor();
            }

            _.each(this.$textarea, function (el) {
                var $el = $(el);

                var config = {
                    //height: $el.height()
                    sharedSpaces: {
                        top: $el.attr('id') + '-toolbar'
                    }
                };

                //if ($el.attr('contenteditable')) {
                CKEDITOR.inline($el.attr('id'), config);
                //} else {
                //    $el.ckeditor(config);
                //}

                CKEDITOR.instances[$el.attr('id')].on('change', this.ckChange);
                CKEDITOR.instances[$el.attr('id')].on('focus', this.ckFocus);
                CKEDITOR.instances[$el.attr('id')].on('blur', this.ckBlur);
            }, this);
        }

        //_.each(this.$('[placeholder]'), function (el) {
        //    $(el).ASPlaceholder();
        //});
    },

    ckChange: function (e) {
        var value = e.editor.getData();
        this.model.set($(e.editor.element.$).data('name'), value);
    },

    ckFocus: function (e) {
        var $el = $(e.editor.element.$);
        $el.closest('.Textarea').addClass('is-focused');
    },

    ckBlur: function (e) {
        var $el = $(e.editor.element.$);
        $el.closest('.Textarea').removeClass('is-focused');
    },

    change: function (e) {
        var $input = $(e.target);
        if ($input.attr('type') == 'checkbox') {
            console.log('change');
            this.model.set($input.attr('name'), $input[0].checked);
            console.log(this.model.get('onMain'));
        } else if ($input.prop('tagName') == 'SELECT') {
            this.model.set($input.attr('name'), $input.val());
        } else {
            this.model.set($input.attr('name'), $input.val());
        }
    },

    save: function () {
        var self = this;

        this.$submit = this.$('.save');
        this.$submit.attr('disabled', 'disabled');
        // this.$submit.spin('standard');

        this.model.save(null, {
            success: function (model) {
                self.$submit.removeAttr('disabled');
                // self.$submit.spin(false);
                window.location = window.location.pathname.replace('/new/', '/' + model.id + '/');
            },
            error: function () {
                alert('Ошибка при сохранении');
            }
        }, true);
    }
});
