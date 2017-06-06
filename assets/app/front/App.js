var Backbone = require('backbone');
var _ = require('underscore');
var svg4everybody = require('svg4everybody');

var Settings = require('./Settings');
var Router = require('./Router');

require('reset.css');
require('front/style.less');

require('front/components/TopNav/TopNav');
require('front/components/Footer/Footer');
require('front/components/Content/Content');
require('front/components/Card/Card');
require('front/components/Header/Header');
require('front/components/Nav/Nav');
require('front/components/SetOfCards/SetOfCards');

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
