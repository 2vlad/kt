﻿
var plugin;

function selectedLength(editor) {
	try {
		var r = editor.getSelection().getRanges();
		return Math.abs(r[0].endOffset - r[0].startOffset);
	}
	catch (e) {
		return 0;
	}
}

function getSelectedLink(editor) {
	var range;
	try {
		range = editor.getSelection().getRanges()[0];
	}
	catch (e) {
		return null;
	}

	range.shrink(CKEDITOR.SHRINK_TEXT);
	var root = range.getCommonAncestor();
	return root.getAscendant('a', true);
}

CKEDITOR.plugins.add('myLink', {

	insertLink: function (editor, url) {
		var attributes = {},
			removeAttributes = [],
			data = {};

		attributes['data-cke-saved-href'] = url;

		editor.getSelection().selectRanges([plugin.selectionRange]);

		var selection = editor.getSelection();

		// Browser need the "href" fro copy/paste link to work. (#6641)
		attributes.href = attributes['data-cke-saved-href'];

		attributes.target = '_blank';

		var element = getSelectedLink(editor);

		if (!element || !element.hasAttribute('href')) {
			// Create element if current selection is collapsed.
			var ranges = selection.getRanges(true);
			if (ranges.length == 1 && ranges[0].collapsed) {
				// Short mailto link text view (#5736).
				var text = new CKEDITOR.dom.text(attributes['data-cke-saved-href'], editor.document);
				ranges[0].insertNode(text);
				ranges[0].selectNodeContents(text);
				selection.selectRanges(ranges);
			}

			// Apply style.
			var style = new CKEDITOR.style({element: 'a', attributes: attributes});
			style.type = CKEDITOR.STYLE_INLINE;		// need to override... dunno why.
			style.apply(editor.document);
		}
		else {
			var href = element.data('cke-saved-href');
			element.setAttributes(attributes);
			element.removeAttributes(removeAttributes);
			selection.selectElement(element);
		}
		editor.fire('change');
	},

	init: function (editor) {
		plugin = this;

		editor.addCommand('myLinkDialog',
			{
				exec: function (editor) {
					plugin.selectionRange = editor.getSelection().getRanges()[0];

					window.app.router.linkEditor.showOn(editor, {
						cancel: function () {
						},
						success: plugin.insertLink
					});
				}
			});


		editor.addCommand('myUnlink',
			{
				exec: function (editor) {
					var style = new CKEDITOR.style({element: 'a', type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1});
					editor.removeStyle(style);
				}
			});

		var oldL = -1;

		var selectionRange;

		function check() {
			$('.cke_button__link').remove();

			var commandLink = editor.getCommand('myLinkDialog'),
				commandUnlink = editor.getCommand('myUnlink');

			var range;
			try {
				range = editor.getSelection().getRanges()[0];
				if (!range) return;
			}
			catch (e) {
				return;
			}
			var elem = range.getCommonAncestor(true, true);

			try {
				//if ((selectedLength(editor) == 0) && (oldL == 0))
				//	commandLink.setState(CKEDITOR.TRISTATE_DISABLED);
				//else {
				if ($(elem.$).closest('img').length == 0)
					commandLink.setState(CKEDITOR.TRISTATE_OFF);
				else
					commandLink.setState(CKEDITOR.TRISTATE_DISABLED);
				//}
				oldL = selectedLength(editor);
			} catch (e) {
			}

			try {
				if (getSelectedLink(editor)) {
					commandUnlink.setState(CKEDITOR.TRISTATE_OFF);
				}
				else {
					commandUnlink.setState(CKEDITOR.TRISTATE_DISABLED);
				}
			} catch (e) {
			}
		}

		function tryShowDialog(element) {
			var $el = $(element.$).closest('a');
			if ($el.length != 0) {
				var url = $el.attr('href');

				plugin.element = element;

				plugin.selectionRange = editor.getSelection().getRanges()[0];

				window.app.router.linkEditor.showOn(editor, {
					cancel: function () {
					},
					success: plugin.insertLink
				}, url);
			}
		}

		editor.on('doubleclick', function (evt) {
			tryShowDialog(evt.data.element);
		});

		check();

		editor.on('selectionChange', function (evt) {
			check();
		});

		// Create a toolbar button that executes the plugin command defined above.
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.html#addButton
		editor.ui.addButton('MyLink',
			{
				// Toolbar button tooltip.
				label: 'Ссылка',
				// Reference to the plugin command name.
				command: 'myLinkDialog',
				// Button's icon file path.
				icon: this.path + 'images/iconLink.png'
			});
		editor.ui.addButton('MyUnlink',
			{
				// Toolbar button tooltip.
				label: 'Remove the Link',
				// Reference to the plugin command name.
				command: 'myUnlink',
				// Button's icon file path.
				icon: this.path + 'images/iconUnlink.png'
			});
	}
});
