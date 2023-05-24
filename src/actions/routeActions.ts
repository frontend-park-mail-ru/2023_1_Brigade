import { constantsOfActions } from '@config/actions';
import { Chats } from '@containers/chatList/createChatList';
import { Contacts } from '@containers/contacts/createContacts';
import { router } from '@router/createRouter';

/**
 * Создает экшен для перехода на страницу регистрации
 * @returns {Action} - Экшен
 */
export const createMoveToSignUpAction = () => {
    router.route('/signup');

    return {
        type: constantsOfActions.moveToSignUp,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на страницу авторизации
 * @returns {Action} - Экшен
 */
export const createMoveToLoginAction = () => {
    router.route('/login');

    return {
        type: constantsOfActions.moveToLogin,
        payload: null,
    };
};

/**
 * Создает экшен для рендеринга компонента
 * @returns {Action} - Экшен
 */
export const createRenderAction = () => {
    return {
        type: constantsOfActions.render,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на страницу профиля
 * @returns {Action} - Экшен
 */
export const createMoveToProfileAction = () => {
    router.route('/profile');

    return {
        type: constantsOfActions.moveToProfile,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на страницу контактов
 * @returns {Action} - Экшен
 */
export const createMoveToContactsAction = () => {
    Chats.componentWillUnmount();
    Contacts.componentDidMount();

    return {
        type: constantsOfActions.moveToContacts,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на страницу чатов
 * @returns {Action} - Экшен
 */
export const createMoveToChatsAction = () => {
    Contacts.componentWillUnmount();
    Chats.componentDidMount();

    return {
        type: constantsOfActions.moveToChats,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на домашнюю страницу
 * @returns {Action} - Экшен
 */
export const createMoveToHomePageAction = (): Action => {
    router.route('/');

    return {
        type: constantsOfActions.moveToHomePage,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на страницу создания группы
 * @returns {Action} - Экшен
 */
export const createMoveToCreateGroupAction = (): Action => {
    router.route('/create_group');

    return {
        type: constantsOfActions.moveToCreateGroup,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на страницу создания канала
 * @returns {Action} - Экшен
 */
export const createMoveToCreateChannelAction = (): Action => {
    router.route('/create_channel');

    return {
        type: constantsOfActions.moveToCreateChannel,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на страницу определенного чата
 * @param {object} chat - Объект, содержащий id чата
 * @returns {Action} - Экшен
 */
export const createMoveToChatAction = (chat: { chatId: number }): Action => {
    router.route(`/${chat.chatId}`);

    return {
        type: constantsOfActions.moveToChat,
        payload: null,
    };
};

/**
 * Создает экшен для перехода на страницу определенного чата
 * при нажатии на кнопку редактирования динамическая часть заменяется на компонент SmartAddUserInGroup
 * @param {OpenedChat} chat - Открытый чат
 * @returns {Action} - Экшен
 */
export const createMoveToEditChatAction = (chat: OpenedChat) => {
    if (chat) {
        router.route(`/${chat.id}/add`);
    }

    return {
        type: constantsOfActions.moveToEditChat,
        payload: null,
    };
};
