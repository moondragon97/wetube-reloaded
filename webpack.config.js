const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
console.log(path.resolve(__dirname, "assets", "js"));

const BASE_JS = "./src/client/js/";

module.exports = {
    entry: {
        main: BASE_JS + "main.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        recorder: BASE_JS + "recorder.js",
        commentSection: BASE_JS + "commentSection.js"
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    output: {
        clean: true,
        filename: "js/[name].js",
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