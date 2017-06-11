/*
 Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function (a) {
    // a.extraPlugins = "myLink,sharedspace";
    // a.toolbar = [["Bold", "MyLink", "MyUnlink"]];
    // a.extraAllowedContent = ["a[*]"];
    // a.removePlugins = 'maximize,resize';
    //
    // a.enterMode = CKEDITOR.ENTER_P;
    // a.disableAutoInline = true;
    // a.sharedSpaces = {
    //     top: 'toolbarLocation'
    // };
    a.extraPlugins = "myLink,sharedspace";
    a.toolbar = [["Bold", "MyLink", "MyUnlink"]];
    a.extraAllowedContent = ["a[*]"];
    a.removePlugins = 'maximize,resize';

    a.disableAutoInline = true;
    a.sharedSpaces = {
        top: 'toolbarLocation'
    }
};
