'use strict';
const config = require('../config');
const webpackConfigCreator = require('../src/shared/utils/lib/build/webpackConfigCreator');

const webpackConfig = webpackConfigCreator(config);

module.exports = webpackConfig;
