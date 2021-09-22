const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

// TODO: Extract common html plugin properties
commonHtmlPlugin = {
}

module.exports = {
    entry: {
        index: path.resolve(__dirname, "./src/index.ts"),
        api_consumption: path.resolve(__dirname, "./src/api-consumption.ts")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    resolve: { 
        extension: [ ".tsx", ".ts", "js"]
    },
    module: {
        rules: [
            // Typescript Loader
            {
                test: /\.tsx?$/,
                exclude: /node_module/,
                loader: "ts-loader"
            },
            // SASS Loader
            {
                test: /\.s[ac]ss$/,
                exclude: /node_module/,
                use: [ "style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugin: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html"),
            filename: "index.html",
            inject: false,
            templateParameters: {
                scripts: [
                    "index.bundle.js"
                ]
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/pages/api-consumption.html"),
            filename: "pages/api_consumption.html",
            inject: false,
            templateParameter: {
                scripts: [
                    "index.bundle.js",
                    "api-consumption.bundle.js"
                ]
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/pages/contact.html"),
            filename: "pages/contact.html",
            inject: false,
            templateParameters: {
                scripts: [
                    "index.bundle.js",
                    "contact.bundle.js"
                ]
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/pages/about-me.html"),
            filename: "pages/about-me.html",
            inject: false,
            templateParameters: {
                scripts: [
                    "index.bundle.js",
                ]
            }
        })
    ]
}