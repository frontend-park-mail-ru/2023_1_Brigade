import { auth, login, signUp, logout } from '@utils/api';
import {
    createSetUserAction,
    createInvalidEmailAction,
    createOccupiedEmailAction,
    createDeleteStateAction,
} from '@actions/userActions';
import { router } from '@router/createRouter';
import { Contacts } from '@containers/contacts/createContacts';
import { Chats } from '@containers/chatList/createChatList';
import { Sidebar } from '@containers/sidebar/createSidebar';
import { getWs } from '@utils/ws';

/**
 * Создает экшн для авторизации пользователя.
 * @returns {AsyncAction} Возвращает асинхронную функцию, выполняющую обновление состояния.
 */
export const createAuthAction = (): AsyncAction => {
    return async (dispatch: Dispatch) => {
        const { status, body } = await auth();

        switch (status) {
            case 200:
                const jsonBody = await body;
                dispatch(createSetUserAction(jsonBody));

                getWs();

                Sidebar.componentDidMount();
                Chats.componentDidMount();

                router.route(window.location.pathname);

                break;
            case 401:
                if (window.location.pathname == '/signup') {
                    router.route('/signup');
                } else {
                    router.route('/login');
                }
                break;
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
 * Создает экшн для входа пользователя в систему.
 * @returns {AsyncAction} Возвращает асинхронную функцию, выполняющую действие при успешном входе или сообщение об ошибке.
 */
export const createLoginAction = (
    user: Record<string, unknown>
): AsyncAction => {
    return async (dispatch: Dispatch) => {
        const { status, body } = await login(user);

        switch (status) {
            case 200:
                const jsonBody = await body;
                dispatch(createSetUserAction(jsonBody));

                getWs();

                Sidebar.componentDidMount();
                Chats.componentDidMount();

                router.route('/');

                break;
            case 404:
                dispatch(createInvalidEmailAction(true));
                break;
            case 409:
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
 * Создает экшн для регистрации нового пользователя.
 * @param {Record<string, unknown>} user - Информация о пользователе
 * @returns {AsyncAction} Возвращает асинхронную функцию, выполняющую обработку регистрации или сообщение об ошибке.
 */ 
export const createSignUpAction = (
    user: Record<string, unknown>
): AsyncAction => {
    return async (dispatch: Dispatch) => {
        const { status, body } = await signUp(user);

        switch (status) {
            case 201:
                const jsonBody = await body;
                dispatch(createSetUserAction(jsonBody));

                getWs();

                Sidebar.componentDidMount();
                Chats.componentDidMount();

                router.route('/');

                break;
            case 400:
            // TODO: отрендерить ошибку
            case 409:
                dispatch(createOccupiedEmailAction(true));
                break;
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
 * Создает экшн для выхода текущего пользователя из системы.
 * @returns {AsyncAction} Возвращает асинхронную функцию, выполняющую действие при успешном выходе или сообщение об ошибке.
 */
export const createLogoutAction = (): AsyncAction => {
    return async (dispatch: Dispatch) => {
        const { status } = await logout();

        switch (status) {
            case 204:
                Sidebar.componentWillUnmount();
                Contacts.componentWillUnmount();
                Chats.componentWillUnmount();

                const ws = getWs();
                ws.close();

                router.route('/login');

                dispatch(createDeleteStateAction());

                break;
            case 401:
            // TODO: вроде на все нужно login отрендерить
            case 404:
            // TODO: вроде на все нужно login отрендерить
            case 500:
            // TODO: отрендерить ошибку
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};
