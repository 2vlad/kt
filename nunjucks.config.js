var _ = require('underscore');

module.exports = function (env) {
    var staticPath = '/static/';

    if (typeof window !== 'undefined') {
        staticPath = window.app.settings.staticUrl;
    }

    env.addGlobal('static', function (file) {
        return staticPath + file;
    }, true);
};
