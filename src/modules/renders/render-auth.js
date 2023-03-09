import auth from '../requests/auth.js';

/**
 * implementation rendering of authorization
 * @param {htmlElement} parent - parent element
 * @param {json} config - configuration
 */
export default (parent, config) => {
    auth(parent, config);
};
