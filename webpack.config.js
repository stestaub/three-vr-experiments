var path = require("path");
module.exports = {
    entry: {
        app: ["./app/main.js"]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/assets/",
        filename: "bundle.js"
    },
    devServer: {
        inline: true,
        port: 4200
    },
    watch: true
};