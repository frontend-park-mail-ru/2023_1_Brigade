import { constantsOfActions } from "@config/actions";
import { getContacts } from "@utils/api";

export const createSetContactsAction = (state: AnyObject): Action => {
    return {
        type: constantsOfActions.setContacts,
        payload: state,
    };
};

export const createGetContactsAction = (): AsyncAction => {
    return async (dispatch: (action: Action) => void) => {
        const { status, body } = await getContacts();
        const jsonBody = await body;

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
};
