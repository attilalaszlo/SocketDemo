var sliceArgs = Function.prototype.call.bind(Array.prototype.slice);
var toString  = Function.prototype.call.bind(Object.prototype.toString);
var NODE_ENV  = process.env.NODE_ENV || 'development';
var pkg = require('./package.json');

// Polyfill
Object.assign = require('object-assign');

// Node
var path = require('path');

// NPM
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

// Webpack Plugins
var OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
var CommonsChunkPlugin   = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var DedupePlugin   = webpack.optimize.DedupePlugin;
var DefinePlugin   = webpack.DefinePlugin;
var BannerPlugin   = webpack.BannerPlugin;

/*
 * Config
 */
module.exports = {
  devtool: 'source-map',
  debug: false,
  cache: true,
  context: __dirname,
  stats: {
    chunks: false,
    colors: true,
    reasons: true
  },

  // our Development Server config
  devServer: {
    inline: true,
    colors: true,
    historyApiFallback: true,
    contentBase: '/app',
    publicPath: '/build'
  },

  //
  entry: {
    'bundle': [
      'es6-shim',
      'rxjs',
      'zone.js',
      'reflect-metadata',
      '@angular/core',
      'jquery',
      'bootstrap',
      './app/main'
    ],
  },

  // Config for our build files
  output: {
    path: path.join(__dirname, '/build'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js',
    publicPath: '/build'
  },

  resolve: {
    root: __dirname,
    extensions: ['','.js','.jsx','.ts','.json', '.css', '.html']
  },

  module: {
    loaders: [
      // Support for *.json files.
      { test: /\.json$/,  loader: 'json' },

      // Support for CSS as raw text
      { test: /\.css$/,   loader: 'raw' },

      // support for .html as raw text
      { test: /\.html$/,  loader: 'raw' },

      { test: /\.scss$/, loader: 'style!css!sass' },

      // Support for .ts files.
      { test: /\.ts$/,    loader: 'ts',
        query: {
          'ignoreDiagnostics': [
            // 2300, // 2300 -> Duplicate identifier
            // 2309 // 2309 -> An export assignment cannot be used in a module with other exported elements.
          ]
        },
        exclude: [
          /\.min\.js$/,
          /\.spec\.ts$/,
          /\.e2e\.ts$/,
          /web_modules/,
          /test/,
          /node_modules/
        ]
      }
    ],
    noParse: [
      /rtts_assert\/src\/rtts_assert/,
      /reflect-metadata/
    ]
  },
  ts: {
    silent: true
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'VERSION': JSON.stringify(pkg.version),
      'io':'socket.io-client'
    }),
    new OccurenceOrderPlugin(),
    new DedupePlugin(),
    new CommonsChunkPlugin('bundle','bundle.js',Infinity),
    new CommonsChunkPlugin('common','common.js'),
    new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
  ],

  /*
   * When using `templateUrl` and `styleUrls` please use `__filename`
   * rather than `module.id` for `moduleId` in `@View`
   */
  node: {
    crypto: false,
    __filename: true
  }
};
