
module.exports = {
    entry: "./src/main.js",
    output: {
        path: './build',
        filename: "build.js"
    },

    module: {
        loaders: [
            { test: /\.jade/, loader: 'html!jade-html' }
        ]
    }
};
