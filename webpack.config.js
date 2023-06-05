const path = require("path");

module.exports = {
	entry: "./index.tsx",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
		publicPath: "/",
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".css"],
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)$/,
				exclude: /node_modules/,
				use: "ts-loader",
			},
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname),
		},
		port: 3000,
	},
	devtool: "source-map",
};
