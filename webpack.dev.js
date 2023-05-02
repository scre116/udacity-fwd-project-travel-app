import HtmlWebPackPlugin from 'html-webpack-plugin';

export default {
    entry: './src/client/index.js',
    mode: 'development',
    devtool: 'source-map',
    stats: 'verbose',
    output: {
        filename: 'main.js',
        library: {
            name: 'ClientLib',
            type: 'var'
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
            favicon: "./src/client/images/favicon.png"
        })
    ]
}
