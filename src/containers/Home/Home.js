import React, { Component } from 'react';
import { Link } from 'react-router';

export default class HomeView extends Component {
  render() {
    return (
      <div className='container text-center'>
        <h2>Welcome</h2>
        <Link to='/404'>Go to 404 Page</Link>
        <Link to='/products'>Go to Products Page</Link>
      </div>
    );
  }
}
