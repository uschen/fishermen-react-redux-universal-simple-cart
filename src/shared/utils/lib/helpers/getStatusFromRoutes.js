/**
 * https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/helpers/getStatusFromRoutes.js
 *
 * Return the status code from the last matched route with a status property.
 *
 * @param matchedRoutes
 * @returns {Number|null}
 */
export default (matchedRoutes) => {
  return matchedRoutes.reduce((prev, cur) => cur.status || prev, null);
};
