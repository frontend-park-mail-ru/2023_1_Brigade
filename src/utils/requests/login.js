import { post } from '../ajax.js';
import config from './config.js';

/**
 * implementation request login
 * @param {htmlElement} parent - parent element for rendering
 * @param {json} renderConfig - configuration for rendering
 * @param {htmlElement} inputEmail - input email
 * @param {htmlElement} inputPassword - input password
 */
export default (renderConfig, inputEmail, inputPassword) => {
    post({
        url: config.login,
        body: JSON.stringify({ email: inputEmail.value, password: inputPassword.value }),
    })
        .then(({ status, parsedBody }) => {
            switch (status) {
            case 200:
                parsedBody.then((res) => {
                    renderConfig.chat.render(renderConfig, res.id);
                });
                break;
            case 404:
                inputEmail.classList.add('login-reg__input_error');
                document.querySelector('.invalid-email').classList.remove('invisible');
                break;
            case 409:
                renderConfig.error.render(renderConfig, renderConfig.login.key, { name: '409', description: 'The session is already registered' });
                break;
            case 500:
                renderConfig.error.render(renderConfig, renderConfig.login.key, { name: '500', description: 'Internal error' });
                break;
            default:
            }
        });
};
