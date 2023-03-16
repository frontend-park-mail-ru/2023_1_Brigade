import chat from '../../templates/chat.js';
import getParentElement from '../../utils/getParentElement.js';
import logout from '../requests/logout.js';

/**
 * implementation rendering of main page
 * @param {htmlElement} parent - parent element
 * @param {json} config - configuration
 * @param {int} userId - User identifier
 */
export default (config, userId) => {
    getParentElement().innerHTML = chat();

    if (userId % 2) {
        document.querySelector('.header__user-photo').src = './assets/img/geva.png';
    }

    document.querySelector('.logout').addEventListener('click', (e) => {
        e.preventDefault();

        logout(config);
    });
};
