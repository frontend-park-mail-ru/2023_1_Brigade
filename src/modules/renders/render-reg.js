import reg from '../../templates/reg.js';
import Validator from '../validator.js';
import getParentElement from '../getParentElement.js';
import signup from '../requests/signup.js';

/**
 * implementation rendering of registration page
 * @param {htmlElement} parent - parent element
 * @param {json} config - Configuration
 */
export default (parent, config) => {
    getParentElement().innerHTML = reg();
    const regPageValidator = new Validator(
        '',
        document.querySelector('.email'),
        document.querySelector('.password'),
        document.querySelector('.confirm-password'),
        document.querySelector('.nick'),
    );

    const validEmail = regPageValidator.validateEmail();
    const validPassword = regPageValidator.validatePassword();
    const validConfirmPassword = regPageValidator.validateConfirmPassword();
    const validUsername = regPageValidator.validateNick();

    if (validEmail && validPassword && validConfirmPassword && validUsername) {
        document.querySelector('.reg-but').addEventListener('click', (e) => {
            e.preventDefault();
            signup(
                parent,
                config,
                regPageValidator.getMail(),
                regPageValidator.getPassword(),
                regPageValidator.getUsername(),
                regPageValidator.getConfirmPassword(),
            );
        });
    }

    document.querySelector('.reg-ques').addEventListener('click', (e) => {
        e.preventDefault();

        config.login.render(parent, config);
    });
};
