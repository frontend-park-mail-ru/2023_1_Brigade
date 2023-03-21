import {IState} from "../config";
import {IAction} from "../actions/IAction";

export interface IReducer {
    doAction(state: Object, action: IAction) : Object; // TODO: IState вместо object
}