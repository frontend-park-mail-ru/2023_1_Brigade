import { constantsOfActions } from '@config/actions';
import { createChat } from '@utils/api';
import { createAddChatAction } from '@actions/chatActions';
import { createMoveToChatAction } from './routeActions';

/**
 * Создает экшен для создания группы
 * @param {State} state - Объект, содержащий данные о создаваемой группе чатов
 * @returns {Action} - Экшен
 */
export const createSetCreateGroupAction = (state: StoreState) => {
    return {
        type: constantsOfActions.createGroup,
        payload: state,
    };
};

/**
 * Создает асинхронный экшен для создания группы
 * @param {Record<string, unknown>} group - Объект, содержащий данные создаваемой группы чата
 * @returns {AsyncAction} - Асинхронная функция, которая вызывает экшены для добавления чата и перехода на него или отображает ошибку
 */
export const createCreateGroupAction = (
    group: Record<string, unknown>
): AsyncAction => {
    return async (dispatch: Dispatch) => {
        const { status, body } = await createChat(group);
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
