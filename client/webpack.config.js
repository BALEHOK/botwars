var webpack = require('webpack');

module.exports = {
    target: 'web',
    debug: true,
    devtool: 'source-map',
    stats: {
        colors: true,
        reasons: false
    },
    entry: {
        main: ['./src/app.js']
    },
    output: {
        path: './public',
        filename: 'bundle-[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules']
    },
    resolveLoader: {
        modulesDirectories: ['webpack-loaders', 'node_modules']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query:
                {
                  presets:['react', 'es2015', 'stage-0']
                }
            },
        ],
        noParse: /\.min\.js/
    }
};
