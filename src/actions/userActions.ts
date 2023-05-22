import { constantsOfActions } from '@config/actions';
import { updateUser, uploadAvatar } from '@utils/api';

/**
 * Создает экшен для установки состояния пользователя.
 * @param {User} state - Состояние пользователя.
 * @returns {Action} экшен с типом "setUser" и полезной нагрузкой "state".
 **/
export const createSetUserAction = (state: User) => {
    return {
        type: constantsOfActions.setUser,
        payload: state,
    };
};

/**
 * Создает экшен для невалидного емейла.
 * @param {boolean} state - Состояние емейла
 * @returns {Action} экшен с типом "invalidEmail".
 **/
export const createInvalidEmailAction = (state: boolean) => {
    return {
        type: constantsOfActions.invalidEmail,
        payload: {
            invalidEmail: state,
        },
    };
};

/**
 * Создает экшен для занятого емейла.
 * @param {boolean} state - Состояние емейла
 * @returns {Action} экшен с типом "occupiedEmail".
 **/
export const createOccupiedEmailAction = (state: boolean) => {
    return {
        type: constantsOfActions.occupiedEmail,
        payload: {
            occupiedEmail: state,
        },
    };
};

/**
 * Создает экшен для занятого имени пользователя.
 * @param {boolean} state - Состояние имени пользователя
 * @returns {Action} экшен с типом "occupiedUsername".
 **/
export const createOccupiedUsernameAction = (state: boolean) => {
    return {
        type: constantsOfActions.occupiedUsername,
        payload: {
            occupiedUsername: state,
        },
    };
};

/**
 * Создает экшен для неправильного пароля.
 * @param {boolean} state - Состояние пароля
 * @returns {Action} экшен с типом "incorrectPassword".
 **/
export const createIncorrectPasswordAction = (state: boolean) => {
    return {
        type: constantsOfActions.incorrectPassword,
        payload: {
            incorrectPassword: state,
        },
    };
};

/**
 * Создает асинхронное действие для обновления состояния пользователя.
 * @param {Record<string, unknown>} user - Объект пользователя для обновления.
 * @returns {AsyncAction} Асинхронное действие, которое вызывает "createSetUserAction" или другие действия с ошибками.
 **/
export const createUpdateUserAction = (
    user: Record<string, unknown>
): AsyncAction => {
    return async (dispatch: Dispatch) => {
        const { status, body } = await updateUser(user);
        const jsonBody = await body;
        switch (status) {
            case 200:
                dispatch(createSetUserAction(jsonBody));
                break;
            case 400:
            // TODO:
            case 401:
            // TODO:
            case 404:
                dispatch(createIncorrectPasswordAction(true));
                break;
            case 409:
                dispatch(createOccupiedUsernameAction(true));
                break;
            case 500:
            // TODO:
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает асинхронный экшен для обновления аватара пользователя.
 * @param {File | undefined} avatar - Новый файл аватара для загрузки.
 * @returns {AsyncAction} Асихронный экшен, который либо вызывает "createSetUserAction", либо другие действия с ошибками.
 **/
export const createUpdateUserAvatarAction = (
    avatar: File | undefined
): AsyncAction => {
    return async (dispatch: Dispatch) => {
        if (!avatar) {
            return;
        }

        console.log('update avatar: ', avatar);

        const { status, body } = await uploadAvatar(avatar);
        const jsonBody = await body;

        switch (status) {
            case 201:
                dispatch(createSetUserAction(jsonBody));
                break;
            case 401:
            // TODO:
            case 404:
            // TODO:
            case 500:
            // TODO:
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
};

/**
 * Создает экшен для удаления состояния пользователя.
 * @returns {Action} экшен с типом "deleteState" и пустой нагрузкой.
 **/
export const createDeleteStateAction = () => {
    return {
        type: constantsOfActions.deleteState,
        payload: null,
    };
};
