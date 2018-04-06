var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: "./src/js/app/index.js",
    output: {
        path: __dirname + "/dist/js",
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
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/css', to: '../css' },
            { from: 'src/img', to: '../img' },
            { from: 'src/js/lib', to: '../lib' },
            { from: 'src/index.html', to: '../' },
            { from: 'src/manifest.webmanifest', to: '../' },
            { from: 'src/worker.js', to: '../' }
        ])
    ]
};