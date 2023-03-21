import {IReducer} from "./IReducer";

export const combineReducers = (reducersMap: Map<string, IReducer>) => {
    return (state, action) => {
        const nextState = {}

        Object.entries(reducersMap).forEach(([key, reducer]) => {
            nextState[key] = reducer(state ? state[key] : state, action);
        })

        return nextState;
    }
}
