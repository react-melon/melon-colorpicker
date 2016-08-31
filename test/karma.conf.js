/**
 * @file karma test common config
 * @author leon <ludafa@outlook.com>
 */

const path = require('path');
const babelOptions = require('../package.json').babel;
const istanbul = require('babel-istanbul');

module.exports = {

    basePath: path.join(__dirname, '../'),

    frameworks: ['jasmine', 'browserify'],

    files: [
        'test/spec/**/*.spec.js'
    ],

    browsers: [
        'Chrome',
        'Firefox'
    ],

    preprocessors: {
        'src/**/*.js': ['browserify', 'coverage'],
        'test/**/*.js': ['browserify']
    },

    browserify: {
        debug: true,
        paths: ['./src/*.js', './test/**/**.spec.js'],

        transform: [

            ['babelify', babelOptions],

            ['browserify-istanbul', {
                instrumenter: istanbul,
                instrumenterConfig: {
                    babel: babelOptions
                }
            }]
        ],
        extensions: ['.js']
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
    singleRun: true

};
