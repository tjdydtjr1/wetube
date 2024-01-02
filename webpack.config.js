// webpack 
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path");

console.log(path.resolve(__dirname, ""));
module.exports =
{
    // 진입점
    entry: "./src/client/js/main.js",
    mode: "development",
    plugins: [new MiniCssExtractPlugin()],
    // 출력 위치 
    output:
    {
        filename: "main.js",
        path: path.resolve(__dirname, "assets", "js"),
    },
    // 처리 방법 규칙
    module:
    {
        rules:
        [
            {
                test: /\.js$/,
                use: 
                {
                    loader: "babel-loader",
                    options:
                    {
                        presets:[["@babel/preset-env", {targets: "defaults"}]]
                    }
                },
                test: /\.scss$/,
                use: ["MiniCssExtractPlugin.loader", "css-loader", "sass-loader"]
            }
        ]
    }
};

