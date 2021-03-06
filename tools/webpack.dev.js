/**
 * @file webpack 开发配置
 * @author leon <ludafa@outlook.com>
 */

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: [
        './example/index.js'
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            // 处理 stylus
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
    // stylus loader 中引入 nib 库支持
    stylus: {
        use: [require('nib')()]
    },
    output: {
        path: path.join(__dirname, '../example'),
        publicPath: '/example/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css']
    },
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: 'index.html',
            chunks: ['main'],
            template: './example/index.html'
        })
    ]
};


module.exports = config;
