import { post } from '../ajax.js';
import config from './config.js';

/**
 * implementation request registration
 * @param {htmlElement} parent - parent element for rendering
 * @param {json} renderConfig - configuration for rendering
 * @param {htmlElement} inputEmail - input email
 * @param {htmlElement} inputPassword - input password
 * @param {htmlElement} inputNick - input nickname
 */
export default (parent, renderConfig, inputEmail, inputPassword, inputNick) => {
    post({
        url: config.signup,
        body: JSON.stringify({
            email: inputEmail.value,
            password: inputPassword.value,
            username: inputNick.value,
        }),
    })
        .then(({ status, parsedBody }) => {
            switch (status) {
            case 201:
                parsedBody.then((res) => {
                    renderConfig.chat.render(parent, renderConfig, res.id);
                });
                break;
            case 400:
                renderConfig.error.render(parent, renderConfig, renderConfig.reg.key, { name: '400', description: 'Invalid username' });
                break;
            case 409:
                inputEmail.classList.add('login-reg__input_error');
                document.querySelector('.occupied-email').classList.remove('invisible');
                break;
            case 500:
                renderConfig.error.render(parent, renderConfig, renderConfig.reg.key, { name: '500', description: 'Internal error' });
                break;
            default:
            }
        });
};
