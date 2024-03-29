import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import webpackCommon from "./webpack.common";
import { merge } from "webpack-merge";

const config: webpack.Configuration = merge(webpackCommon, {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
});

export default config;
