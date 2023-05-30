import { constantsOfActions } from '@config/actions';
import { ChatTypes } from '@config/enum';
import { store } from '@store/store';
import {
    chatImage,
    createChat,
    deleteChat,
    editChat,
    getChats,
    getOneChat,
    searchChats,
    uploadAvatar,
} from '@utils/api';
import { router } from '@router/createRouter';
import {
    createMoveToChatAction,
    createMoveToChatsAction,
} from '@actions/routeActions';
import { sendImage } from '@utils/api';

/**
 * Создает экшен "isNotRendered".
 * @returns {{ type: string, payload: null }} - Экшен
 */
export const createIsNotRenderedAction = () => {
    return {
        type: constantsOfActions.isNotRendered,
        payload: null,
    };
};

/**
 * Создает экшен "openChat".
 * @param {Chat} chat - Чат, который нужно открыть.
 * @returns {{ type: string, payload: Object }} - Экшен
 */
export const createOpenChatAction = (chat: Chat | undefined) => {
    console.log('debug createOpenChatAction: ', chat);
    return {
        type: constantsOfActions.openChat,
        payload: chat,
    };
};

/**
 * Создает экшен "addChat".
 * @param {Chat} chat - Чат, который нужно добавить.
 * @returns {{ type: string, payload: Object }} - Экшен
 */
export const createAddChatAction = (chat: Chat) => {
    return {
        type: constantsOfActions.addChat,
        payload: chat,
    };
};

/**
 * Создает экшен "setChats".
 * @param {Chat} chat - Список чатов, которые нужно установить.
 * @returns {{ type: string, payload: Object }} - Экшен
 */
export const createSetChatsAction = (chat: Chat) => {
    return {
        type: constantsOfActions.setChats,
        payload: chat,
    };
};

/**
 * Создает экшен "getOneChat".
 * @param {Record<string, number>} chat - Чат, который нужно получить.
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createGetOneChatAction = (chat: Record<string, number>) => {
    return async (dispatch: Dispatch) => {
        const { status, body } = await getOneChat(chat);

        const jsonBody = await body;

        switch (status) {
            case 200:
                dispatch(createOpenChatAction(jsonBody));
                break;
            case 401:
            // TODO: отрендерить ошибку
            case 403:
            // TODO: отрендерить ошибку
            case 404:
            // TODO: отрендерить ошибку
            case 500:
            // TODO: отрендерить ошибку
            case 0:
                console.log(body);
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает экшен "getChats".
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createGetChatsAction = () => {
    return async (dispatch: Dispatch) => {
        const { status, body } = await getChats();

        const jsonBody = await body;

        switch (status) {
            case 200:
                dispatch(createSetChatsAction(jsonBody));
                break;
            case 401:
            // TODO: отрендерить ошибку
            case 404:
            // TODO: отрендерить ошибку
            case 500:
            // TODO: отрендерить ошибку
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает экшен "createDialog".
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createCreateDialogAction = (contact: User) => {
    return async (dispatch: Dispatch, state: GetState) => {
        let haveThisChat = false;

        state().chats?.forEach((chat: Chat) => {
            if (
                chat.type === ChatTypes.Dialog &&
                (chat.members[0]?.id == contact.id ||
                    chat.members[1]?.id == contact.id)
            ) {
                dispatch(createMoveToChatAction({ chatId: chat.id }));
                dispatch(createMoveToChatsAction());
                haveThisChat = true;
            }
        });

        if (haveThisChat) {
            return;
        }

        const { status, body } = await createChat({
            type: ChatTypes.Dialog,
            title: contact.nickname,
            members: [contact.id, store.getState().user?.id],
        });

        const jsonBody = await body;

        switch (status) {
            case 201:
                dispatch(createAddChatAction(jsonBody));
                dispatch(createMoveToChatsAction());
                dispatch(createMoveToChatAction({ chatId: jsonBody.id }));
                break;
            case 401:
            // TODO: отрендерить ошибку
            case 404:
            // TODO: отрендерить ошибку
            case 500:
            // TODO: отрендерить ошибку
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает экшен "deleteChat".
 * @returns {{ type: string, payload: Object }} - Экшен
 */
export const createDeleteChatFromStoreAction = (chat: Chat) => {
    return {
        type: constantsOfActions.deleteChat,
        payload: chat,
    };
};

/**
 * Создает экшен "deleteChat", который з
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createDeleteChatAction = (deletedChatId: number | undefined) => {
    return async (dispatch: Dispatch, state: GetState) => {
        if (!deletedChatId) {
            return;
        }

        state().chats?.forEach((chat: Chat) => {
            if (chat.id == deletedChatId) {
                dispatch(createDeleteChatFromStoreAction(chat));
            }
        });

        const { status } = await deleteChat(deletedChatId);

        switch (status) {
            case 204:
                router.route('/');
                break;
            case 401:
            // TODO: отрендерить ошибку
            case 403:
            // TODO: отрендерить ошибку
            case 404:
            // TODO: отрендерить ошибку
            case 500:
            // TODO: отрендерить ошибку
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает экшен "editChat".
 * @returns {{ type: string, payload: Object }} - Экшен
 */
export const createEditChatFromStoreAction = (updateGroupState: {
    id: number;
    type: ChatTypes;
    title: string;
    members: (number | undefined)[];
}) => {
    return {
        type: constantsOfActions.editChat,
        payload: updateGroupState,
    };
};

/**
 * Создает экшен "editChat"
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createEditChatAction = (updateGroupState: {
    id: number;
    type: ChatTypes;
    title: string;
    members: (number | undefined)[];
}) => {
    return async (dispatch: Dispatch) => {
        if (updateGroupState) {
            dispatch(createEditChatFromStoreAction(updateGroupState));
        }

        const { status, body } = await editChat({
            id: updateGroupState.id,
            type: updateGroupState.type,
            title: updateGroupState.title,
            members: updateGroupState.members,
        });

        const jsonBody = await body;

        switch (status) {
            case 201:
                dispatch(createOpenChatAction(jsonBody));
                router.route(`/${updateGroupState.id}`);
                break;
            case 401:
            // TODO: отрендерить ошибку
            case 404:
            // TODO: отрендерить ошибку
            case 500:
            // TODO: отрендерить ошибку
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает экшен "createChannel".
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createCreateChannelAction = (newchannel: {
    image: File | undefined;
    channel: {
        type: number;
        title: string;
        avatar: string;
        description: string;
        members: number[];
    };
}): AsyncAction => {
    return async (dispatch: (action: Action) => void) => {
        if (newchannel.image) {
            const { status, body } = await chatImage(newchannel.image);

            if (status === 201) {
                newchannel.channel.avatar = await body;
            }
        }

        const { status, body } = await createChat(newchannel.channel);
        const jsonBody = await body;

        switch (status) {
            case 201:
                dispatch(createAddChatAction(jsonBody));
                dispatch(createMoveToChatAction({ chatId: jsonBody.id }));
                break;
            case 401:
            // TODO: отрендерить ошибку
            case 404:
            // TODO: отрендерить ошибку
            case 500:
            // TODO: отрендерить ошибку
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает экшен "searchChats".
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createSearchChatsAction = (str: string) => {
    return async (dispatch: (action: Action) => void) => {
        const { status, body } = await searchChats(str);
        const jsonBody = await body;

        switch (status) {
            case 200:
                dispatch(createSetSearchedChatsAction(jsonBody));
                break;
            case 401:
            // TODO: отрендерить ошибку
            case 404:
            // TODO: отрендерить ошибку
            case 500:
            // TODO: отрендерить ошибку
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает экшен "setSearchedChats".
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createSetSearchedChatsAction = (body: Record<string, unknown>) => {
    return {
        type: constantsOfActions.setSearchedChats,
        payload: body,
    };
};

/**
 * Создает экшен "deleteSearchedChats".
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createDeleteSearchedChatsAction = () => {
    return {
        type: constantsOfActions.deleteSearchedChats,
        payload: {
            founded_messages: undefined,
            founded_chats: undefined,
            founded_channels: undefined,
            founded_contacts: undefined,
        },
    };
};

/**
 * Создает экшен "addUserInChat".
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createAddUserInChat = (user: User) => {
    return {
        type: constantsOfActions.addUserInChat,
        payload: user,
    };
};

/**
 * Создает экшен "deleteUserInChat".
 * @returns {function} - Функция, которая делает запрос и возвращает промис с результатом.
 */
export const createDeleteUserInChat = () => {
    return {
        type: constantsOfActions.deleteUserInChat,
        payload: null,
    };
};
