import "webpack-dev-server";
import webpack from "webpack";
import webpackCommon from "./webpack.common";
import { merge } from "webpack-merge";
import { paths } from "./paths";

const config: webpack.Configuration = merge(webpackCommon, {
  stats: {
    errorDetails: true
  },
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    watchFiles: [paths.scripts, `${paths.root}/index.html`],
    static: {
      directory: paths.public
    },
    compress: true,
    port: 9200
  }
});

export default config;
