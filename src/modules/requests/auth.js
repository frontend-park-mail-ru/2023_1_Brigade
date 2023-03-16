import { get } from '../../utils/ajax.js';
import config from './config.js';

/**
 * implementation request authorization
 * @param {htmlElement} parent - parent element for rendering
 * @param {json} renderConfig - configuration for rendering
 */
export default (renderConfig) => {
    get({
        url: config.auth,
    })
        .then(({ status, parsedBody }) => {
            switch (status) {
            case 200:
                parsedBody.then((res) => {
                    renderConfig.chat.render(renderConfig, res.id);
                });
                break;
            case 401:
                renderConfig.login.render(renderConfig);
                break;
            case 500:
                renderConfig.error.render(renderConfig, renderConfig.login.key, { name: '500', description: 'Internal error' });
                break;
            default:
            }
        });
};
