import {combineReducers} from "../reducers/combineReducers";
import {openMenuReducer} from "../reducers/openMenuReducer";
import {initialState} from "../config";
import {openMenu} from "../actionCreater/openMenu";

export const createStore = (reducer) => {
    let state = reducer(undefined, {type: '__INIT__'});
    let subscribers = [];

    return {
        getState: () => state,
        dispatch: action => {
            state = reducer(state, action)
            subscribers.forEach(cb => cb())
        },
        subscribe: (cb) => subscribers.push(cb),
    };
};

export const applyMiddleWare = (middleware) => {
    return (createStore) => {
        return (reducer) => {
            const store = createStore(reducer);
            return {
                dispatch: action => middleware(store)(store.dispatch)(action),
                getState: store.getState,
            }
        }
    }
}

// инициализируем сущности
export const menu = new openMenuReducer();
export const rootReducer = combineReducers({'menuState': menu});
