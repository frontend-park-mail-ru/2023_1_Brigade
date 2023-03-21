import log from '../../../templates/login.js';
import getParentElement from '../../../utils/getParentElement.js';
import login from '../../../utils/requests/login.js';
import Validator from '../../../utils/validator.js';

/**
 * implementation rendering of login page
 * @param {htmlElement} parent - parent element
 * @param {json} config - configuration
 */
export default (config) => {
    getParentElement().innerHTML = log();

    const loginPageValidator = new Validator(document.querySelector('.email'), document.querySelector('.password'));

    loginPageValidator.validate();

    document.querySelector('.login-but').addEventListener('click', (e) => {
        e.preventDefault();

        if (loginPageValidator.isValid()) {
            login(config, loginPageValidator.getMail(), loginPageValidator.getPassword());
        }
    });

    document.querySelector('.login-ques').addEventListener('click', (e) => {
        e.preventDefault();

        config.reg.render(config);
    });
};