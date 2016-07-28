import dataProvider from './../models';
import co from 'co';
const debug = require('debug')('app:server:services:cart');
const Cart = dataProvider.Cart;

const cartService = {
  name: 'cart',
  read(req, resource, params, config, done) {
    debug('read');
    co(function *() {
      return yield Cart.getOne();
    })
    .then((cart) => {
      return done(null, {
        data: [cart],
      });
    })
    .catch(done);
  },
  update(req, resource, params, body, config, done) {
    debug('update', body);
    co(function *() {
      yield Cart.updateOne(body);
      return yield Cart.getOne();
    })
    .then((cart) => {
      debug('update', 'cart', cart);
      done(null, {
        data: [cart],
      });
    })
    .catch(done);
  },
};

export default cartService;
