import reg from '../templates/reg.js';
import {
    validateEmail, validatePassword, validateNick, validateConfirmPassword,
} from './validator.js';
import { post } from './ajax.js';
import getParentElement from './getParentElement.js';
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
            post({
                url: '/signup/',
                body: JSON.stringify({
                    email: inputEmail.value,
                    password: inputPassword.value,
                    nick: inputNick.value,
                }),
            })
                .then(({ status, parsedBody }) => {
                    switch (status) {
                    case 201:
                        parsedBody.then((res) => {
                            config.chat.render(parent, config, res.id);
                        });
                        break;
                    case 400:
                        config.error.render(parent, config, config.reg.key, { name: '400', description: 'Invalid username' });
                        break;
                    case 409:
                        inputEmail.classList.add('login-reg__input_error');
                        document.querySelector('.occupied-email').classList.remove('invisible');
                        break;
                    case 500:
                        config.error.render(parent, config, config.reg.key, { name: '500', description: 'Internal error' });
                        break;
                    default:
                    }
                });
        }
    });

    document.querySelector('.reg-ques').addEventListener('click', (e) => {
        e.preventDefault();

        config.login.render(parent, config);
    });
};
