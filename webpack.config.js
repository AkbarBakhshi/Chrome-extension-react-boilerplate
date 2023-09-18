const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        popup: path.resolve('src/popupIndex.tsx'),
        options: path.resolve('src/optionsIndex.tsx'),
        background: path.resolve('src/background/background.ts'),
        contentScript: path.resolve('src/contentScript/contentScript.ts'),
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        }
                    }],
                exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
              test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
              type: 'asset/resource'
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('public'),
                    to: path.resolve('build'),
                },
            ],
        }),
        ...getHtmlPlugins([
            'popup',
            'options'
        ]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].js",
    },
    optimization: {
      splitChunks: {
        chunks(chunk) {
          return chunk.name !== 'contentScript' && chunk.name !== 'background'
        }
      },
    }
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "Weather extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}