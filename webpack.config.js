var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var autoprefixer = require('autoprefixer');
var csswring = require('csswring');

module.exports = {
  eslint: {
    configFile: './.eslintrc'
  }
}

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
            // Use eslint-loader as pre-loader to check source files, not modified by other loaders (like babel-loader)
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [{loader: 'eslint-loader', options: {}}]
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
