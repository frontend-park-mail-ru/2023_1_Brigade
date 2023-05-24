import { constantsOfActions } from '@config/actions';

export const createAddMessageAction = (message: Message) => {
    return {
        type: constantsOfActions.addMessage,
        payload: message,
    };
};

export const createEditMessageAction = (message: Message) => {
    return {
        type: constantsOfActions.editMessage,
        payload: message,
    };
};

export const createDeleteMessageAction = (message: Message) => {
    return {
        type: constantsOfActions.deleteMessage,
        payload: message,
    };
};
