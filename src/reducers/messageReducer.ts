import { constantsOfActions } from '@config/actions';

export const reduceMessage = (state: StoreState, action: Action) => {
    const payload = action.payload as Message;

    const index = state.openedChat?.messages.findIndex(
        (message) => message.id === payload.id
    );

    const i = state.chats?.findIndex((chat) => chat.id === payload.chat_id);

    switch (action.type) {
        case constantsOfActions.addMessage:
            if (payload.chat_id === state.openedChat?.id) {
                state.openedChat?.messages.unshift(payload as Message);
            }

            if ((i || i === 0) && i !== -1 && state.chats) {
                state.chats[i].last_message = payload;
            }

            return {
                ...state,
            };
        case constantsOfActions.editMessage:
            if (
                payload.chat_id === state.openedChat?.id &&
                ((index && index !== -1) || index === 0)
            ) {
                state.openedChat?.messages.splice(index, 1, payload);
            }

            if (
                (i || i === 0) &&
                i !== -1 &&
                state.chats &&
                payload.id === state.chats[i].last_message.id
            ) {
                state.chats[i].last_message = payload;
            }

            return {
                ...state,
            };
        case constantsOfActions.deleteMessage:
            if (
                payload.chat_id === state.openedChat?.id &&
                ((index && index !== -1) || index === 0)
            ) {
                state.openedChat?.messages.splice(index, 1);
            }

            if (
                (i || i === 0) &&
                i !== -1 &&
                state.chats &&
                payload.id === state.chats[i].last_message.id
            ) {
                state.chats[i].last_message.body = 'УДАЛЕНО';
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
