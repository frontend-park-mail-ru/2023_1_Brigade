import {applyMiddleWare, createStore, rootReducer} from "./store/store";
import {logger} from "./middlewars/logger";

const createStoreWithMiddleWare = applyMiddleWare(logger)(createStore);
const storeWithMiddleWare = createStoreWithMiddleWare(rootReducer);

console.log(storeWithMiddleWare.getState());

storeWithMiddleWare.dispatch({type: 'SUCCESS'});

console.log(storeWithMiddleWare.getState());

setTimeout(() => {
    console.log(storeWithMiddleWare.getState());
}, 5000)
