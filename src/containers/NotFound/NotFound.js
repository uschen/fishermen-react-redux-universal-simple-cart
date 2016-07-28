import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class NotFound extends Component {
  static propTypes = {
    code: PropTypes.number,
    name: PropTypes.name,
    message: PropTypes.String,
  }

  defaultProps = {
    code: 404,
    name: 'NotFound Error',
    message: 'The page you requested is not found',
  }

  render() {
    const { code, name, message } = this.props;
    return (
      <div className='container text-center'>
        <h1>Woooops {name} (code: {code})</h1>
        <hr />
        <p>{message}</p>
        <Link to='/'>Back To Home View</Link>
      </div>
      );
  }
}

export default NotFound;
