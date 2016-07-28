import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { isGlobalLoading } from '../../redux/modules/app';
import { getGlobalLoadingState } from 'penny-redux-async-connect';
import NotFound from './../NotFound/NotFound';
import _debug from 'debug';
import { Layout, Panel } from 'react-toolbox';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import { Link as RouterLink } from 'react-router';
import { Button } from 'react-toolbox/lib/button';
import { actions as cartActions, getCart } from './../../redux/modules/cart';

const debug = _debug('app:containers:App');

import styles from './styles.scss';
import './../../styles/core.scss';
import './../../styles/vendors/_bootstrap.scss';
import './../../styles/vendors/_material_icons.scss';

const mapStateToProps = (state) => ({
  cart: getCart(state.cart),
  globalLoading: isGlobalLoading(state.app),
  globalLoadingState: getGlobalLoadingState(state.reduxAsyncConnect),
  // sidebar
});

class App extends Component {
  static displayName = 'Home';
  static propTypes = {
    cart: PropTypes.object.isRequired,
    routes: PropTypes.array,
    params: PropTypes.object,
    children: PropTypes.node,
    globalLoadingState: PropTypes.object.isRequired,
    globalLoading: PropTypes.bool,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static reduxAsyncConnect = [{
    promise: ({ store }) => {
      debug('reduxAsyncConnect');
      const { dispatch } = store;
      const promises = [];
      const dispatchRes = dispatch(cartActions.fetch());
      promises.push(dispatchRes);
      return Promise.all(promises);
    },
  }];

  render() {
    debug('render');
    const {
      cart,
      children,
      globalLoading,
      globalLoadingState,
      routes,
      params,
    } = this.props;
    return (
      <Layout>
        <Panel>
          <AppBar flat>
            <Navigation>
              <RouterLink className='no-decoration' to={'/products'}>
                <Button icon='reorder' label='Products' inverse />
              </RouterLink>
              <RouterLink className='no-decoration' to={'/cart'}>
                <Button icon='shopping_cart' label={`Cart (${cart.products.length})`} inverse />
              </RouterLink>
            </Navigation>
          </AppBar>
          <Grid className={styles.appContent}>
            {globalLoading &&
              (<ProgressBar className={styles.progressBar} mode='indeterminate' />)
            }
            {globalLoadingState.error ?
              <NotFound
                code={globalLoadingState.error.code}
                name={globalLoadingState.error.name}
                message={globalLoadingState.error.message}
              /> :
              children
            }
          </Grid>
        </Panel>
      </Layout>
    );
  }
}

export default connect(mapStateToProps)(App);
