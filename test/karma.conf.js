/**
 * @file karma test common config
 * @author leon <ludafa@outlook.com>
 */

const path = require('path');

module.exports = {

    basePath: path.join(__dirname, '../'),

    frameworks: ['jasmine'],

    files: [
        'test/spec/**/*.spec.js'
    ],

    browsers: [
        // 'Firefox',
        'Chrome'
    ],

    preprocessors: {
        'src/**/*.js': ['coverage'],
        'test/**/*.js': ['webpack']
    },

    webpack: {
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/
                },
                {
                    test: /\.json$/,
                    loader: 'json'
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
        stylus: {
            use: [require('nib')()]
        },
        devtool: 'inline-source-map',
        externals: {
            'react/lib/ExecutionEnvironment': true,
            'react/lib/ReactContext': true,
            'react/addons': true
        }
    },

    webpackMiddleware: {
        stats: 'errors-only'
    },


    autoWatch: true,

    // logLevel: config.LOG_DEBUG,
    reporters: ['progress', 'coverage', 'dots'],

    coverageReporter: {
        dir: path.join(__dirname, './coverage'),
        reporters: [
            // reporters not supporting the `file` property
            {type: 'html'},
            {type: 'lcov', subdir: 'lcov'}
        ]
    },

    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false

};
