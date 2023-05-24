import { constantsOfActions } from '@config/actions';
import { getContacts } from '@utils/api';

/**
 * Создает экшен setContacts
 * @param {User[]} state - Объект, содержащий данные о контактах
 * @returns {Action} - Экшен
 */
export const createSetContactsAction = (state: User[]) => {
    return {
        type: constantsOfActions.setContacts,
        payload: state,
    };
};

// export const createFindContactsByString = (string: string): AsyncAction => {
//     return async (dispatch: Dispatch) => {
//         const { status, body } = await getContactsByString(string);
//         const jsonBody = await body;
//         switch (status) {
//             case 200:
//             // return dispatch(createSetContactsAction(jsonBody));
//             case 401:
//             // TODO: отрендерить ошибку
//             case 404:
//             // TODO: отрендерить ошибку
//             case 500:
//             // TODO: отрендерить ошибку
//             case 0:
//             // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
//             default:
//             // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
//         }
//     };
// };

/**
 * Создает асинхронный экшен для получения контактов
 * @returns {AsyncAction} - Асинхронная функция, которая вызывает экшен для установки контактов или отображает ошибку
 */
export const createGetContactsAction = (): AsyncAction => {
    return async (dispatch: Dispatch) => {
        const { status, body } = await getContacts();
        const jsonBody = await body;

        switch (status) {
            case 200:
                return dispatch(createSetContactsAction(jsonBody));
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
