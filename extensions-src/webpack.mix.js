let mix = require("laravel-mix");
const Dotenv = require("dotenv-webpack");

mix.js("./index.js", "../extensions/pushy/assets/pushy.js")
    .react()
    .setPublicPath("../extensions/pushy/assets")
    .options({
        manifest: false,
        terser: {
            extractComments: false,
        },
    })
    .webpackConfig({
        plugins: [new Dotenv()],
    });
