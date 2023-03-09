import { get } from '../ajax.js';
import config from './config.js';

/**
 * implementation request authorization
 * @param {htmlElement} parent - parent element for rendering
 * @param {json} renderConfig - configuration for rendering
 */
export default (parent, renderConfig) => {
    get({
        url: config.auth,
    })
        .then(({ status, parsedBody }) => {
            switch (status) {
            case 200:
                parsedBody.then((res) => {
                    renderConfig.chat.render(parent, renderConfig, res.id);
                });
                break;
            case 401:
                renderConfig.login.render(parent, renderConfig);
                break;
            case 500:
                renderConfig.error.render(parent, renderConfig, renderConfig.login.key, { name: '500', description: 'Internal error' });
                break;
            default:
            }
        });
};
