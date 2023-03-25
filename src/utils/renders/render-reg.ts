import template from '@pages/reg/reg.pug';
import Validator from '@utils/validator';
import signup from '@utils/requests/signup';

/**
 * implementation rendering of registration page
 * @param {htmlElement} parent - parent element
 * @param {json} config - Configuration
 */
export default (config) => {
    document.querySelector('#root').innerHTML = template();
    const regPageValidator = new Validator(
        document.querySelector('.email'),
        document.querySelector('.password'),
        document.querySelector('.confirm-password'),
        document.querySelector('.nick'),
    );

    regPageValidator.validate();

    document.querySelector('.reg-but').addEventListener('click', (e) => {
        e.preventDefault();
        if (regPageValidator.isValid()) {
            signup(
                config,
                regPageValidator.getMail(),
                regPageValidator.getPassword(),
                regPageValidator.getUsername(),
                regPageValidator.getConfirmPassword(),
            );
        }
    });

    document.querySelector('.reg-ques').addEventListener('click', (e) => {
        e.preventDefault();

        config.login.render(config);
    });
};
