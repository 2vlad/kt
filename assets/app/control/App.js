var Backbone = require('backbone');
var _ = require('underscore');
var svg4everybody = require('svg4everybody');

var Settings = require('./Settings');
var Router = require('./Router');

require('material-design-lite/material.min.css');
require('material-design-lite/material.min.js');

require('control/components/GridAdd/GridAdd.js');
require('control/components/GridItem/GridItem.js');
require('control/components/BtnRemove/BtnRemove.js');
require('control/components/Btn/Btn');

require('control/components/TopNav/TopNav');
require('control/components/Header/Header');
require('control/components/Button/Button');
require('control/components/Textarea/Textarea');
require('control/components/Input/Input');
require('control/components/Card/Card');
require('control/components/Source/Source');

require('reset.css');
require('control/style.less');

svg4everybody();

app.configure = Settings.configure;
app.configure();

window.app.vent = _.extend({}, Backbone.Events);

window.app.state = {};

window.app.els = {
    $window: $(window),
    $body: $('body'),
    $htmlBody: $('html,body'),
    $content: $('.Content')
};

app.router = new Router();
app.router.start();
