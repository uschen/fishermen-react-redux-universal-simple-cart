import React, { PropTypes, Component } from 'react';
import { Link as RouterLink } from 'react-router';
import { connect } from 'react-redux';
import { actions as productsActions, getProductById } from './../../redux/modules/products';
import { actions as cartActions, isProductInCart, getCart } from './../../redux/modules/cart';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';

import styles from './styles.scss';
// import _debug from 'debug';
// const debug = _debug('app:containers:App');

const mapStateToProps = (state, ownProps) => ({
  cart: getCart(state.cart),
  product: getProductById(state.products, ownProps.params.id),
  inCart: isProductInCart(state.cart, { id: ownProps.params.id }),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  addProduct: (product) => dispatch(cartActions.addProduct(product)),
  removeProduct: (product) => dispatch(cartActions.removeProduct(product)),
  updateCart: (cart) => dispatch(cartActions.update(cart)),
});


class Product extends Component {
  static propTypes = {
    cart: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
    inCart: PropTypes.bool,
    addProduct: PropTypes.func.isRequire,
    removeProduct: PropTypes.func.isRequire,
    updateCart: PropTypes.func.isRequire,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  static reduxAsyncConnect = [{
    promise: ({ params, store }) => {
      const { dispatch, getState } = store;
      const promises = [];
      const product = getProductById(getState().products, params.id);
      if (product) {
        return Promise.resolve();
      }
      const dispatchRes = dispatch(productsActions.fetch({ id: params.id }));
      promises.push(dispatchRes);
      return Promise.all(promises);
    },
  }];

  addToCart = () => {
    const { product, addProduct, updateCart } = this.props;
    const { store: { getState } } = this.context;
    addProduct(product);
    updateCart(getCart(getState().cart));
  }

  removeFromCart = () => {
    const { product, removeProduct, updateCart } = this.props;
    const { store: { getState } } = this.context;
    removeProduct(product);
    updateCart(getCart(getState().cart));
  }

  render() {
    const { product, inCart } = this.props;
    return (
      <Card
        className={styles.productCard}
      >
        <CardTitle
          title={product.name}
        />
        <CardMedia
          aspectRatio='wide'
          image={product.image}
        />
        <CardText>{product.description}</CardText>
        <CardActions>
          <Button
            icon='add_shopping_cart'
            label='Add to cart'
            disabled={inCart}
            onClick={this.addToCart}
          />
          <Button
            icon='remove_shopping_cart'
            label='Remove from cart'
            disabled={!inCart}
            onClick={this.removeFromCart}
            accent
          />
        </CardActions>
      </Card>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
