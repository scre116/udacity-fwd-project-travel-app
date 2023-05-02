import path, {dirname} from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
// import WorkboxPlugin from 'workbox-webpack-plugin';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    entry: './src/client/index.js',
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimizer: [new TerserPlugin({}), new CssMinimizerPlugin({})],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                loader: "babel-loader",
            },
            {
                test: /.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
            favicon: "./src/client/images/favicon.png"
        }),
        new CleanWebpackPlugin({}),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        // new WorkboxPlugin.GenerateSW({
        // }),
    ]
}
