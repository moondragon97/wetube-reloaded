const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
console.log(path.resolve(__dirname, "assets", "js"));

module.exports = {
    entry: "./src/client/js/main.js",
    mode: "development",
    watch: true,
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    output: {
        clean: true,
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                },
            },
            {
                test: /\.scss$/,
                // https://github.com/webpack-contrib/sass-loader
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], 
            },
        ]
    }
};