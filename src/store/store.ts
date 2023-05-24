import { createStore, applyMiddleware, thunk } from '@framework/redux';
import { combineReducers } from '@framework/combineReducers';
import { reducers } from '@config/reducers';

const reducersMap = combineReducers(reducers);

export const store = applyMiddleware(thunk)(createStore)(reducersMap);
