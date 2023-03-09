import reg from '../../templates/reg.js';
import {
    validateEmail, validatePassword, validateNick, validateConfirmPassword,
} from '../validator.js';
import getParentElement from '../getParentElement.js';
import signup from '../requests/signup.js';

/**
 * implementation rendering of registration page
 * @param {htmlElement} parent - parent element
 * @param {json} config - Configuration
 */
export default (parent, config) => {
    getParentElement().innerHTML = reg();

    document.querySelector('.reg-but').addEventListener('click', (e) => {
        e.preventDefault();

        const inputEmail = document.querySelector('.email');
        const inputPassword = document.querySelector('.password');
        const inputNick = document.querySelector('.nick');
        const inputConfirmPassword = document.querySelector('.confirm-password');

        const valEmail = validateEmail(inputEmail);
        const valPassword = validatePassword(inputPassword);
        const valNick = validateNick(inputNick);
        const valConfirmPassword = validateConfirmPassword(inputPassword, inputConfirmPassword);

        if (valEmail && valPassword
        && valNick && valConfirmPassword) {
            signup(parent, config, inputEmail, inputPassword, inputNick, inputConfirmPassword);
        }
    });

    document.querySelector('.reg-ques').addEventListener('click', (e) => {
        e.preventDefault();

        config.login.render(parent, config);
    });
};
