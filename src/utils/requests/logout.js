import { deleteSession } from '../ajax.js';
import config from './config.js';

/**
 * implementation request logout
 * @param {htmlElement} parent - parent element for rendering
 * @param {json} renderConfig - configuration for rendering
 */
export default (renderConfig) => {
    deleteSession({
        url: config.logout,
    }).then(({ status }) => {
        switch (status) {
        case 204:
            renderConfig.login.render(renderConfig);
            break;
        case 401:
            renderConfig.error.render(renderConfig, renderConfig.chat.key, { name: '401', description: 'Cookie not found' });
            break;
        case 404:
            renderConfig.error.render(renderConfig, renderConfig.chat.key, { name: '404', description: 'User session not found' });
            break;
        case 500:
            renderConfig.error.render(renderConfig, renderConfig.chat.key, { name: '500', description: 'Internal error' });
            break;
        default:
        }
    });
};
