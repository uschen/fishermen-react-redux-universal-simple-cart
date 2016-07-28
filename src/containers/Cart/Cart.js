import React, { PropTypes, Component } from 'react';
import { Link as RouterLink } from 'react-router';
import { connect } from 'react-redux';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { actions as cartActions, getCart } from './../../redux/modules/cart';
import { routerActions } from 'react-router-redux'
import { Button, IconButton } from 'react-toolbox/lib/button';
import styles from './styles.scss';

const mapStateToProps = (state, ownProps) => ({
  cart: getCart(state.cart),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeProduct: (product) => dispatch(cartActions.removeProduct(product)),
  updateCart: (cart) => dispatch(cartActions.update(cart)),
  goToProducts: () => dispatch(routerActions.push('/products')),
});

class Cart extends Component {
  static propTypes = {
    cart: PropTypes.object.isRequired,
    removeProduct: PropTypes.func.isRequire,
    updateCart: PropTypes.func.isRequire,
    goToProducts: PropTypes.func.isRequire,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  static reduxAsyncConnect = [{
    promise: ({ store }) => {
      const { dispatch } = store;
      const promises = [];
      const dispatchRes = dispatch(cartActions.fetch());
      promises.push(dispatchRes);
      return Promise.all(promises);
    },
  }];

  removeFromCart = (product) => {
    const { removeProduct, updateCart } = this.props;
    const { store: { getState } } = this.context;
    removeProduct(product);
    updateCart(getCart(getState().cart));
  }

  checkout = () => {
    const { updateCart, goToProducts } = this.props;
    updateCart({ products: [] })
    .then(goToProducts);
  }

  render() {
    const { cart } = this.props;

    return (
      <Card
        className={styles.cartCard}
      >
        <CardTitle
          title='Card'
          subtitle={`${cart.products.length} items`}
        />
        <CardText>
          <List
            selectable={false}
            ripple={false}
          >
            <ListSubHeader caption='Cart Items' />
            {cart.products.map((product) =>
              <ListItem
                key={product.id}
                avatar={product.image}
                caption={product.name}
                rightActions={[
                  <IconButton
                    key='delete'
                    icon='delete'
                    accent
                    onClick={() => this.removeFromCart(product)}
                  />,
                ]}
              />
            )}
          </List>
        </CardText>
        <CardActions>
          <Button label='Checkout' onClick={this.checkout}/>
        </CardActions>
      </Card>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
