import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

export default {
  entry: {
    jsnes: "./src/index.js",
    "jsnes.min": "./src/index.js",
    commonjs: { import: "./src/index.js", filename: "jsnes.cjs" },
  },
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(import.meta.dirname, "dist"),
    filename: "[name].js",
    library: "jsnes",
    libraryTarget: "umd",
    globalObject: "globalThis",
    umdNamedDefine: true,
    clean: true,
  },
  resolve: {
    extensions: [".js", ".ts"],
    extensionAlias: { ".js": [".js", ".ts"] },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(import.meta.dirname, "tsconfig.json"),
            onlyCompileBundledFiles: true,
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ["js"],
      exclude: "node_modules",
    }),
  ],
};
