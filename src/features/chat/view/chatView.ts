import chat from '../../../templates/chat.js';
import getParentElement from '../../../utils/getParentElement.js';
import logout from '../../../utils/requests/logout.js';

/**
 * implementation rendering of main page
 * @param {htmlElement} parent - parent element
 * @param {json} config - configuration
 * @param {int} userId - User identifier
 */


export class Chat {
    header: HTMLElement;
    chatList: HTMLElement;
    viewChat: HTMLElement;
    groupInfo: HTMLElement;


    constructor(...props: HTMLElement[]) {
        [this.header, this.chatList, this.viewChat, this.groupInfo] = props;
    }

    render() {
        // TODO: вызывать функцию render, только у тех элементов, которые изменили своё состояние
        // пока что перерисовываем всю страницу
        console.log('перерисовали чето там');
    }
}

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
