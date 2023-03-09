import log from '../../templates/login.js';
import { validateEmail, validatePassword } from '../validator.js';
import getParentElement from '../getParentElement.js';
import login from '../requests/login.js';

/**
 * implementation rendering of login page
 * @param {htmlElement} parent - parent element
 * @param {json} config - configuration
 */
export default (parent, config) => {
    getParentElement().innerHTML = log();

    document.querySelector('.login-but').addEventListener('click', (e) => {
        e.preventDefault();

        const inputEmail = document.querySelector('.email');
        const inputPassword = document.querySelector('.password');

        const valEmail = validateEmail(inputEmail);
        const valPassword = validatePassword(inputPassword);

        if (valEmail && valPassword) {
            login(parent, config, inputEmail, inputPassword);
        }
    });

    document.querySelector('.login-ques').addEventListener('click', (e) => {
        e.preventDefault();

        config.reg.render(parent, config);
    });
};
