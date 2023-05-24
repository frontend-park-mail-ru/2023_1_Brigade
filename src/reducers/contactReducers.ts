import { constantsOfActions } from '@config/actions';

/**
 * Обрабатывает экшен на установку контактов в State
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после установки контактов
 */
export const reduceSetContacts = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.setContacts:
            const payload = action.payload as Record<string, User[]>;
            if (action.payload) {
                return {
                    ...state,
                    contacts: payload.contacts as User[],
                };
            }
        default:
            return {
                ...state,
            };
    }
};
