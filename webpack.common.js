const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const fs = require("fs")

const scripts = {
    index: "index.bundle.js",
    api_consumption: "api_consumption.bundle.js",
    contact: "contact.bundle.js",
}

const htmlTemplates = [
    { filename: "index", path: "", scripts: [scripts.index] },
    { filename: "api-consumption", path: "pages", scripts: [scripts.index, scripts.api_consumption] },
    { filename: "contact", path:"pages", scripts: [scripts.index, scripts.contact] },
    { filename: "about-me", path:"pages", scripts: [scripts.index] }
];

const navigationHtml = fs.readFileSync(path.resolve(__dirname, "./src/templates/navigation.html"));

module.exports = {
    entry: {
        index: path.resolve(__dirname, "./src/index.ts"),
        api_consumption: path.resolve(__dirname, "./src/scripts/api-consumption.ts"),
        contact: path.resolve(__dirname, "./src/scripts/contact.ts"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        assetModuleFilename: "images/[name][ext]"
    },
    resolve: { 
        extensions: [ ".tsx", ".ts", "js"]
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
            },
            // Assets Loader
            {
                test: /\.(png|svg|jpg|jpeg)$/i,
                type: "asset/resource"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...htmlTemplates.map(template => {
            const htmlFileName = template.path
                                 ? [template.path, template.filename].join("/")
                                 : template.filename;

            return new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `./src/${htmlFileName}.html`),
                filename: `${template.filename}.html`,
                inject: false,
                scripts: template.scripts,
                navigation: navigationHtml
            });
        }),
    ],
}