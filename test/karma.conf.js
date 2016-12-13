/**
 * @file karma test common config
 * @author leon <ludafa@outlook.com>
 */

const path = require('path');
const babelOptions = require('../package.json').babel;

babelOptions.plugins.push('istanbul');

module.exports = {

    basePath: path.join(__dirname, '../'),

    frameworks: ['jasmine'],

    files: [
        'test/spec/**/*.spec.js'
    ],

    browsers: [
        'Chrome',
        'Firefox'
    ],

    preprocessors: {
        'src/**/*.js': ['coverage'],
        'test/**/*.js': ['webpack']
    },

    webpack: {
        module: {
            preLoaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/,
                    query: babelOptions
                }
            ],
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json'
                }
            ]
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
