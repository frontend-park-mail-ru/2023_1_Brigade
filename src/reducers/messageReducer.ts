import { constantsOfActions } from '@config/actions';

export const reduceMessage = (state: StoreState, action: Action) => {
    const payload = action.payload as Message;

    const index = state.openedChat?.messages.findIndex(
        (message) => message.id === payload.id
    );

    switch (action.type) {
        case constantsOfActions.addMessage:
            state.openedChat?.messages.unshift(action.payload as Message);

            return {
                ...state,
            };
        case constantsOfActions.editMessage:
            if ((index && index !== -1) || index === 0) {
                state.openedChat?.messages.splice(index, 1, payload);
            }

            return {
                ...state,
            };
        case constantsOfActions.deleteMessage:
            if ((index && index !== -1) || index === 0) {
                state.openedChat?.messages.splice(index, 1);
            }

            return {
                ...state,
            };
        default:
            return {
                ...state,
            };
    }
};
