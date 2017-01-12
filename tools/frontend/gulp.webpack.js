var chalk = require('chalk');
var webpack = require('webpack');


var statsFunction = function (err, stats) {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }

        return;
    }

    console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true    // Shows colors in the console
    }));
};

/*
 Функция для вызова сборки webpack'ом с выводом ошибок.
 */
module.exports = function (config) {
    try {
        if (config.watch) {
            webpack(config).watch({}, statsFunction);
        } else {
            webpack(config).run(statsFunction);
        }
    } catch (err) {
        console.log(chalk.red(err.message));
    }
};
