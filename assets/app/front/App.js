var Backbone = require('backbone/backbone');
var _ = require('underscore/underscore');

var svg4everybody = require('svg4everybody');

require('reset.css');
require('front/style.less');

var Settings = require('./Settings');
var Router = require('./Router');

svg4everybody();

app.configure = Settings.configure;
app.configure();

window.app.vent = _.extend({}, Backbone.Events);

window.app.state = {
};

window.app.els = {
    $window: $(window),
    $body: $('body'),
    $htmlBody: $('html,body'),
    $content: $('.Content')
};

app.router = new Router();

app.router.start();
