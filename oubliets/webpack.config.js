var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: "./src/js/app/index.js",
    output: {
        path: __dirname + "/www/js",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {
                test: /\.js$/,
                exclude: /(node_modules|hooks|platforms|plugins|www)/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            }
        ]
    },
    plugins: []
};