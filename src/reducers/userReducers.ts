import { constantsOfActions } from '@config/actions';

/**
 * Обрабатывает экшен на установку данных о пользователе в State
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после установки данных о пользователе
 */
export const reduceSetUser = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.setUser:
            if (action.payload) {
                return {
                    ...state,
                    user: action.payload as User,
                };
            }
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на удаление данных из State
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после удаления данных из State
 */
export const reduceDeleteState = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.deleteState:
            return {};
        default:
            return {
                ...state,
            };
    }
};
