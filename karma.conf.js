import path from 'path';

module.exports = function(config) {
  config.set({
    basePath: '',
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    singleRun: false,
    frameworks: [
      'mocha',
      'sinon',
      'chai',
      'jasmine-jquery',
      'jasmine',
      'jquery-2.1.0'
    ],
    files: [
      { pattern: 'tmp/assets/**/*.css', included: false, served: true, watched: true },
      { pattern: 'tmp/**/*.html', included: false, served: true, watched: true },
      'tests.webpack.js'
    ],
    exclude: [],
    browsers: ['Chrome'],
    preprocessors: {
      'tests.webpack.js': ['webpack','sourcemap']
    },
    reporters: ['spec','coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        preLoaders: getPreloaders(),
        loaders: getLoaders()
      },
      resolve: {
        modulesDirectories: ['node_modules', 'src'],
        extensions: ['', '.js']
      }
    },
    webpackServer: {
      quiet: true,
      noInfo: true
    },
    plugins: [
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-babel-preprocessor',
      'karma-html2js-preprocessor',
      'karma-sourcemap-loader',
      'karma-coverage',
      'karma-jasmine',
      'karma-jquery',
      'karma-jasmine-jquery',
      'karma-mocha',
      'karma-sinon',
      'karma-chai',
      'karma-spec-reporter'
    ]
  })
}


function getPreloaders() {
  var preLoaders = [
    // set up test coverage on files in src/assets/js
    {
      test: /\.js$/, 
      loader: 'isparta', 
      include: path.join(__dirname, 'src/assets/js'),
      exclude: /node_modules/
    }
  ];

  return preLoaders;
}

function getLoaders() {
  var loaders = [
    // set up babel loader on all js code
    { 
      test: /\.js$/, 
      exclude: /(node_modules|src\/assets\/js\/lib)/,
      loader: 'babel'
    }
  ];
  return loaders;
}


