import {constantsOfActions} from "@config/actions";
import {contacts, createGroup, updateUser} from "@utils/api";

export const createSetCreateGroupAction = (state: anyObject) : Action => {
    return {
        type: constantsOfActions.createGroup,
        payload: state,
    }
}

export const createCreateGroupAction = (user: anyObject) : AsyncAction => {
    return async (dispatch: (action: Action) => void, state: anyObject) => {
        const { status, body } = await createGroup(user);
        const { jsonBody } = await body;

        switch (status) {
            case 200:
                dispatch(createSetCreateGroupAction(jsonBody));
                break;
            case 400:
            // TODO:
            case 401:
            // TODO:
            case 404:
            // TODO:
            case 409:
                break;
            case 500:
            // TODO:
            case 0:
            // TODO: тут типа жееееееесткая ошибка случилось, аж catch сработал
            default:
            // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
        }
    };
}
