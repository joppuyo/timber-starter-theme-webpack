const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    twig: './src/twig.js',
    style: './src/scss.js',
    script: './src/js/script.js',
  },
  output: {
    filename: '[name].js',
    publicPath: '/wp-content/themes/starter-theme-gulp-webpack/dist/',
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(twig)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: 'src',
              name: '[path][name].[ext]',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'html-loader' },
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
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
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};
