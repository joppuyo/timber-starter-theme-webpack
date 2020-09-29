// SPDX-FileCopyrightText: 2017-2020 Johannes Siipola
// SPDX-License-Identifier: CC0-1.0

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WatchTimePlugin = require('webpack-watch-time-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  let config = {
    entry: {
      twig: './src/twig.js',
      style: './src/scss/style.scss',
      script: './src/js/script.js',
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js?ver=[chunkhash]',
      publicPath: '/wp-content/themes/timber-starter-theme-webpack/dist/',
    },
    resolve: {
      extensions: ['*', '.js'],
    },
    mode: 'development',
    performance: {
      hints: false,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.twig$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                context: 'src',
                name: '[path][name].[ext]',
              },
            },
            { loader: 'extract-loader' },
            {
              loader: 'html-loader',
              options: {
                minimize: false,
                interpolate: true,
                attrs: ['img:src', 'link:href'],
              },
            },
          ],
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/env'],
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|tiff|webp|gif|ico|woff|woff2|eot|ttf|otf|mp4|webm|wav|mp3|m4a|aac|oga)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                context: 'src',
                name: '[path][name].[ext]?ver=[md5:hash:8]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new WatchTimePlugin(),
      new CleanWebpackPlugin(),
    ],
  };

  if (argv.mode !== 'production') {
    config.module.rules.push({
      test: /\.s?css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [autoprefixer({})],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            precision: 10,
          },
        },
      ],
    });
  }

  if (argv.mode === 'production') {
    config.module.rules.push({
      test: /\.s?css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              cssnano({
                preset: 'default',
              }),
              autoprefixer({}),
            ],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            precision: 10,
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.svg$/,
      enforce: 'pre',
      use: [
        {
          loader: 'svgo-loader',
          options: {
            precision: 2,
            plugins: [
              {
                removeViewBox: false,
              },
            ],
          },
        },
      ],
    });
  }

  return config;
};
