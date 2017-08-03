/**
 * @file webpack demo
 * @author leon <ludafa@outlook.com>
 */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {

    entry: {
        main: ['./example/index.js']
    },

    output: {
        path: 'public',
        filename: '[name].[chunkhash].js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: [
                    'babel'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.json(\?.*)?$/,
                loader: 'json'
            },
            {
                test: /\.styl$/,
                loader: 'style!css!stylus?paths=node_modules&resolve url&include css'
            },
            // 处理 iconfont
            {
                test: /\.(svg|eot|ttf|woff|woff2)($|\?)/,
                loader: 'file'
            }
        ]
    },

    devtool: 'source-map',

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: 'index.html',
            chunks: ['main'],
            template: './example/index.html'
        })
    ]
};

module.exports = config;
