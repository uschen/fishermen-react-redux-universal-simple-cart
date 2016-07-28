import utils from './utils';
const mongoose = utils.mongoose;
const debug = require('debug')('app:models:Cart');

const CartSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  products: [{
    id: String,
    name: String,
    price: Number,
    image: String,
    description: String,
  }],
}, {
  _id: true,
  id: true,
  collection: 'carts',
  minimize: false,
  autoIndex: true,
  toObject: {
    getters: true,
    virtuals: true,
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
});

CartSchema.index({
  'products.id': 1,
}, {
  unique: true,
});

CartSchema.statics.addOne = function *(data) {
  debug('addOne', data);
  return yield this.create(data);
};

CartSchema.statics.getOne = function *() {
  debug('getOne');
  const query = this.findOne({ _id: 'default_cart' });
  query.lean(true);
  const res = yield query.exec();
  return res;
};

CartSchema.statics.updateOne = function *(data) {
  debug('updateOne');
  const updateObj = {
    $set: data,
  };
  yield this.update({
    _id: 'default_cart',
  }, updateObj, { upsert: true });
};

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
