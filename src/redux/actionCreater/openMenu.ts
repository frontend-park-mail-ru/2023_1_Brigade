import {openMenuAction} from "../actions/openMenu";
import {IAction} from "../actions/IAction";

export function openMenu() : IAction {
    return openMenuAction;
}