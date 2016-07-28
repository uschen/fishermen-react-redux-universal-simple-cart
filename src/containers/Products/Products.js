import React, { PropTypes, Component } from 'react';
import { Link as RouterLink } from 'react-router';
import { connect } from 'react-redux';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import { actions as productsActions, getVisibleProducts } from './../../redux/modules/products';

const mapStateToProps = (state) => ({
  products: getVisibleProducts(state.products),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetch: (params) => dispatch(productsActions.fetch(params)),
});

class ProductsList extends Component {
  static propTypes = {
    products: PropTypes.array.isRequired,
    fetch: PropTypes.func.isRequire,
  };

  static reduxAsyncConnect = [{
    promise: ({ store }) => {
      const { dispatch } = store;
      const promises = [];
      const dispatchRes = dispatch(productsActions.fetch());
      promises.push(dispatchRes);
      return Promise.all(promises);
    },
  }];

  render() {
    const { products } = this.props;

    return (
      <List selectable ripple>
        <ListSubHeader caption='Products' />
        {products.map((product) =>
          <RouterLink className='no-decoration' to={`/products/${product.id}`} key={product.id}>
            <ListItem
              avatar={product.image}
              caption={product.name}
              rightIcon='star'
            />
          </RouterLink>
        )}
      </List>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);
