'use strict';
/* eslint key-spacing:0 */
module.exports = (config) => ({
  compiler_fail_on_warning : false,
  compiler_hash_type       : 'chunkhash',
  compiler_devtool         : null,
  compiler_stats           : {
    chunks : true,
    chunkModules : true,
    colors : true,
  },
  compiler_public_path: '/',
});
