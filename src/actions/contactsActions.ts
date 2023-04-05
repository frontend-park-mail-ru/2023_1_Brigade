import {constantsOfActions} from "@config/actions";
import {contacts} from "@utils/api";

export const createSetContactsAction = (state: anyObject) : Action => {
    return {
        type: constantsOfActions.getContacts,
        payload: state,
    }
}

export const createGetContactsAction = () : AsyncAction => {
    return async (dispatch: (action: Action) => void, state: anyObject) => {
        const { status, body } = await contacts();
        let jsonBody = await body;

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
}
