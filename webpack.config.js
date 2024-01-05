// webpack 
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path");

// 공통적인 경로
const BASE_JS = "./src/client/js/";

module.exports =
{
    // 진입점
    entry: 
    {
        main: BASE_JS + "main.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        recorder: BASE_JS + "recorder.js",
        commentSection: BASE_JS + "commentSection.js",
    },
    // 변경사항 재 컴파일
    plugins: 
    [
        new MiniCssExtractPlugin
        (
            {
                filename: "css/styles.css"
            }
        )
    ],
    // 출력 위치 
    output:
    {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        // 필요없는 파일 제거
        clean: true
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
                // 반대의 실행순서를 가짐
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    }
};

