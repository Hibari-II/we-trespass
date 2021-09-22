const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

// TODO: Extract common html plugin properties
commonHtmlPlugin = {
}


const htmlTemplates = [
    { filename: "index", path: "", scripts: ["index.bundle.js"] },
    { filename: "api-consumption", path: "pages/", scripts: ["index.bundle.js", "api-consumption.bundle.js"] },
    { filename: "contact", path:"pages/", scripts: ["index.bundle.js", "contact.bundle.js"] },
    { filename: "about-me", path:"pages/", scripts: ["index.bundle.js"] }
]


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
        ...htmlTemplates.map(template => 
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `./src/${template.path}${template.filename}.html`),
                filename: `pages/${template.filename}.html`,
                inject: false,
                templateParameters: { scripts: template.scripts }
            })
        )
    ]
}