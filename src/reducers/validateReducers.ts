import { constantsOfActions } from '@config/actions';

/**
 * Обновляет состояние объекта при получении соответствующих действий.
 * @param {State} state - Текущее состояние объекта.
 * @param {Action} action - Объект, содержащий данные действия.
 * @returns {Object} - Новое состояние объекта.
 */
export const reduceValidate = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.invalidEmail:
        case constantsOfActions.occupiedEmail:
        case constantsOfActions.occupiedUsername:
        case constantsOfActions.incorrectPassword:
            return {
                ...state,
                ...(action.payload as Record<string, unknown>),
            };
        default:
            return {
                ...state,
            };
    }
};
