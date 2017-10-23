const webpack = require('webpack');

module.exports = {
    entry: {
        script: './static/src/js/script.js',
    },
    output: { path: __dirname, filename: '[name].bundle.js' },
    resolve: {
        extensions: ['*', '.js'],
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module, count) {
                const context = module.context;
                return context && context.indexOf('node_modules') >= 0;
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                    },
                },
            },
        ],
    },
};
