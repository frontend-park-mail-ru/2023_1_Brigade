const createStore = (reducer) => {
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

// для каждого reducer-a должен хранииться свой state
const initialState = {
    count: 0,
    messages: 1,
    tupic: 123,
};

const INCREMENT = 'INCREMENT'

const increment = count => ({
    type: INCREMENT,
    payload: count,
});

const countReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INCREMENT':
             return {
                 ...state,
                 count: state.count + action.payload,
             };
        case 'DECREMENT':
            return {
                ...state,
                count: state.count - action.payload,
            };

        default:
            return {
                ...state,
            }
    }
};

const initialUserState = {
    users: [],
}

const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case 'SUCCESS':
            return {
                ...state,
                users: action.payload,
            }

        default:
            return {
                ...state,
            };
    }
}

const combineReducers = (reducersMap) => {
    return (state, action) => {
        const nextState = {}

        Object.entries(reducersMap).forEach(([key, reducer]) => {
            nextState[key] = reducer(state ? state[key] : state, action);
        })

        return nextState;
    }
}

const rootReducer = combineReducers({userState: userReducer, countState: countReducer});

const logger = store => dispatch => action => {
    console.log(action.type);
}

const thunk = store => dispatch => action => {
    if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
    }

    return dispatch(action);
}

const applyMiddleWare = (middleware) => {
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

const init = {
    isLoading: false,
}

const reducerNew = (state = init, action) => {
    switch (action.type) {
        case 'STARTED':
            return {
                ...state,
                isLoading: true,
            }
        case 'SUCCESS':
            return {
                ...state,
                isLoading: false,
            }
        default:
            return {
                ...state,
            }
    }
}

const someAction = () => {
    return async(dispatch) => { // getState
        dispatch ({type: 'STARTED'});

        await new Promise(resolve => setTimeout(() => resolve(), 2000));

        dispatch ({type: 'SUCCESS'});
    }
}

const createStoreWithMiddleWare = applyMiddleWare(logger)(createStore);
const storeWithMiddleWare = createStoreWithMiddleWare(reducerNew);

console.log(storeWithMiddleWare.getState());

storeWithMiddleWare.dispatch({type: 'SUCCESS'});

console.log(storeWithMiddleWare.getState());

setTimeout(() => {
    console.log(storeWithMiddleWare.getState());
}, 5000)
