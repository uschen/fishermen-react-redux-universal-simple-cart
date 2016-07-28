/**
 * fetcher Products service
 */
import faker from 'faker';
import _debug from 'debug';
import _find from 'lodash/fp/find';
const debug = _debug('app:server:services:products');

const PRODUCT_COUNT = 10;
const products = [];

for (let i = 0; i < PRODUCT_COUNT; i++) {
  products.push({
    id: faker.random.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    image: faker.image.image(),
    description: faker.lorem.sentence(),
  });
}

const productsService = {
  name: 'products',
  read(req, resource, { id }, config, done) {
    if (!id) {
      const data = {
        data: products,
      };
      done(null, data);
    } else {
      const product = _find({ id })(products);
      if (!product) {
        const notfoundError = new Error('NotfoundError');
        notfoundError.code = 404;
        done(notfoundError);
      } else {
        done(null, {
          data: [product],
        });
      }
    }
  },
};

export default productsService;
