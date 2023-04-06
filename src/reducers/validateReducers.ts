import { constantsOfActions } from "@/config/actions";


export const reduceValidate = (state: anyObject, action: Action) => {
    switch (action.type) {
    case constantsOfActions.invalidEmail:
    case constantsOfActions.occupiedEmail:
    case constantsOfActions.occupiedUsername:
        return {
            ...state,
            ...action.payload,
        };
    default:
        return {
            ...state,
        }
    }
};