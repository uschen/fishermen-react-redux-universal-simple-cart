
// We use an explicit public path when the assets are served by webpack
// to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
module.exports = (config) => ({
  compiler_public_path: `http://${config.webpack_dev_server_host}:${config.webpack_dev_server_port}/`,
});
