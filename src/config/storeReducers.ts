import { reduceSetUser, reduceDeleteState } from "@/reducers/userReducers";
import { constantsOfActions } from "./actions";
import { reduceValidate } from "@/reducers/validateReducers";
import { reduceSetContacts } from "@/reducers/contactReducers";
import {reduceSetCreateGroup} from "@reducers/createGroupReducers";

/**
* Устанавливает соответствие между экшенами и редьюсерами
*/
export const reducers = [
    { type: constantsOfActions.setUser, reducer: reduceSetUser },
    { type: constantsOfActions.deleteState, reducer: reduceDeleteState },
    { type: constantsOfActions.invalidEmail, reducer: reduceValidate },
    { type: constantsOfActions.occupiedEmail, reducer: reduceValidate },
    { type: constantsOfActions.occupiedUsername, reducer: reduceValidate },
    { type: constantsOfActions.getContacts, reducer: reduceSetContacts },
    { type: constantsOfActions.createGroup, reducer: reduceSetCreateGroup },
];
