import {changeThemeAction} from "../actions/changeTheme";
import {IAction} from "../actions/IAction";

export function changeTheme() : IAction {
    return changeThemeAction;
}
