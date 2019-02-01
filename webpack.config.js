const path = require('path');

module.exports = {
  entry: './client/App/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/public/local'),
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'client'),
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components'),
      ],
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-0'],
          },
        },
        {
          loader: 'eslint-loader',
        },
      ],
    }, {
      test: /.css?$/,
      use: [
        'style-loader',
        'css-loader',
      ],
    }, {
      test: /.less?$/,
      include: [
        path.resolve(__dirname, 'client'),
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components'),
      ],
      use: [
        'style-loader',
        'css-loader',
        'less-loader',
      ],
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [
        'url-loader',
      ]
    }, {
      test: /\.ttf$/i,
      use: [
        'url-loader',
      ],
    }],
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css', '.less'],
    alias: {
      $containers: path.resolve(__dirname, './client/App/containers'),
      $components: path.resolve(__dirname, './client/App/components'),
      $actions: path.resolve(__dirname, './client/App/actions'),
      $config: path.resolve(__dirname, './client/App/config'),
      $styles: path.resolve(__dirname, './client/App/styles'),
      $utils: path.resolve(__dirname, './client/App/utils'),
    },
  },
  devtool: 'source-map',
};
