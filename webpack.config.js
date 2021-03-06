var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var autoprefixer = require('autoprefixer');
var csswring = require('csswring');

module.exports = {
    output: {
        filename: '[name].[hash:8].js'
    },

    resolve: {
        modules: ['node_modules',
            path.join(__dirname, '/assets/app/'),
            path.join(__dirname, '/assets/custom_libs/')]
    },

    module: {
        rules: [
            // Используем eslint-loader как прелоадер, чтобы проверять js-исходники,
            // не измененные другими лоадерами как, например, babel-loader-ом.
            {
                test: /\.js$/,
                exclude: ['node_modules', path.join(__dirname, '/assets/custom_libs/')],
                enforce: 'pre',
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {cache: true}
                    }
                ]
            },
            // Пока выключил, так как ломает underscore.js в админке
            // {
            //     test: /\.js$/,
            //     exclude: ['node_modules', path.join(__dirname, '/assets/custom_libs/')],
            //     use: [
            //         {
            //             loader: 'babel-loader',
            //             options: {
            //                 plugins: [
            //                     // Автоматически вставляет 'use strict' в начале всех js-файлов, спасая нас от рутины.
            //                     ['transform-strict-mode', {strict: true}]
            //                 ]
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.jinja$/,
                use: {
                    loader: 'nunjucks-loader',
                    options: {
                        config: __dirname + '/nunjucks.config.js',
                        jinjaCompat: false
                    }
                }
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        'css-loader',
                        'postcss-loader',
                        'less-loader'
                    ]
                })
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        'css-loader',
                        'postcss-loader'
                    ]
                })
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [
                    autoprefixer({
                        browsers: ['last 2 version']
                    })
                ]
            }
        }),
        new ExtractTextPlugin({
            filename: '[name].[hash:8].css',
            disable: false,
            allChunks: true
        })
    ],

    externals: {
        jquery: 'jQuery'
    }
};
