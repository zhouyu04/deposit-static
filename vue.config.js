let proxyObj = {};
const CompressionPlugin = require("compression-webpack-plugin");

const webpack = require("webpack");

proxyObj['/ws'] = {
    ws: true,
    target: "ws://localhost:8085"
};
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8085',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    },
    configureWebpack: {

        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                Popper: ["popper.js", "default"]
            })
        ]
    }
}
