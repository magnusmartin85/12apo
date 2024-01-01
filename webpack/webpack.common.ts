import CopyPlugin from "copy-webpack-plugin";
import webpack from "webpack";
import { paths } from "./paths";

const config: webpack.Configuration = {
  entry: `${paths.scripts}/index.ts`,
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: `${paths.root}/index.html`,
          to: paths.public
        }
      ]
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        type: "asset/resource",
        generator: {
          filename: "12apo-core.css"
        },
        use: ["sass-loader"]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: "12apo-core.js",
    path: paths.public,
    clean: true
  }
};

export default config;
