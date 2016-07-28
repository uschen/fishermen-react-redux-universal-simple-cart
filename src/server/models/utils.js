import bluebird from 'bluebird';
import mongooseLib from 'mongoose';

const mongoose = bluebird.promisifyAll(mongooseLib);
mongoose.Promise = bluebird;

module.exports = {
  mongoose,
};
