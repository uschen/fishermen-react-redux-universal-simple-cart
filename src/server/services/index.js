import Fetchr from 'fetchr';

import productsService from './products';
import cartService from './cart';

Fetchr.registerService(productsService);
Fetchr.registerService(cartService);

export default Fetchr;
