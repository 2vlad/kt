/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

var componentGenerator = require('./component/index.js');

module.exports = function (plop) {
    plop.setGenerator('component', componentGenerator);
};