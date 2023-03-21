import {IReducer} from "./IReducer";
import {IAction} from "../actions/IAction";
import {IState, initialState} from "../config";
import {changeThemeAction} from "../actions/changeTheme";

export class openMenuReducer implements IReducer {
    doAction(state = initialState, action: IAction = changeThemeAction) : Object {
        switch (action.type) {
            case 'OPEN_MENU':
                return {
                    ...state,
                    chatMenu: action.payload,
                };
            case 'CLOSE_MENU':
                return {
                    ...state,
                    chatMenu: action.payload,
                };

            default:
                return {
                    ...state,
                }
        }
    }
}
