/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: {
        app: ['./src/index.ts'],
    },
    output: {
        filename: 'index.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.pug'],
        plugins: [new TsconfigPathsPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug3-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                type: 'asset/resource',
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource',
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html',
        }),
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: ['dist'],
                },
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets/img'),
                    to: path.resolve(__dirname, 'dist/assets/img'),
                },
                {
                    from: path.resolve(__dirname, 'src/assets/fonts'),
                    to: path.resolve(__dirname, 'dist/assets/fonts'),
                },
                {
                    from: path.resolve(__dirname, 'src/assets/icons'),
                    to: path.resolve(__dirname, 'dist/assets/icons'),
                },
                {
                    from: path.resolve(__dirname, 'src/sw.js'),
                    to: path.resolve(__dirname, 'dist'),
                },
                {
                    from: path.resolve(__dirname, 'src/offline.html'),
                    to: path.resolve(__dirname, 'dist'),
                },
                {
                    from: path.resolve(__dirname, 'src/manifest.json'),
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
    ],
    devServer: {
        watchFiles: path.join(__dirname, 'src'),
        port: 10000,
        historyApiFallback: true,
    },
    optimization: {
        minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ['gifsicle', { interlaced: true }],
                            ['jpegtran', { progressive: true }],
                            ['optipng', { optimizationLevel: 5 }],
                            ['svgo', { name: 'preset-default' }],
                        ],
                    },
                },
            }),
        ],
    },
};
