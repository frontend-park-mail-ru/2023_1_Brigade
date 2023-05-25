import { constantsOfActions } from '@/config/actions';

/**
 * оздает хранилище с помощью заданных редьюсеров и возвращает объект Store (состояние, функцию dispatch и функцию subscribe).
 * @param {Map<string, Reducer>} reducers - объект типа Map, содержащий редьюсеры в качестве значений и их имена в качестве ключей.
 * @returns {Store} - объект Store, содержащий текущее состояние state, функцию для обновления состояния dispatch и функцию подписки на обновление состояния subscribe.
 */
export const createStore = (reducers: Map<string, Reducer>): Store => {
    let state: StoreState = {};
    const subscribers = new Map<string, Callback>();

    return {
        getState: () => state,
        dispatch: (action: Action) => {
            const reducer = reducers.get(action.type);
            if (reducer) {
                state = reducer(state, action);
            }
            subscribers.forEach((cb) => {
                cb(state);
            });
        },
        subscribe: (key: string, cb: (state: StoreState) => void) => {
            subscribers.set(key, cb);
            return () => {
                subscribers.delete(key);
            };
        },
    };
};

/**
 * Применяет список функций-обработчиков в цепочке к функции dispatch
 * @param {...Function} middlewares - Список функций-обработчиков
 * @return {Function} - Функция, принимающая действие и передающая его через цепочку обработчиков
 */
export const applyMiddleware =
    (middleware: Middleware) =>
    (createStoreFunc: CreateStore) =>
    (reducers: Map<string, Reducer>) => {
        const store = createStoreFunc(reducers);
        return {
            getState: store.getState,
            dispatch: (action: Action | AsyncAction) =>
                middleware(store)(store.dispatch)(action),
            subscribe: store.subscribe,
        };
    };

/**
 * Создает функцию-обработчик, которая принимает действие и передает его дальше через цепочку обработчиков или вызывает его, если действие является асинхронным
 * @param {Object} store - Хранилище Redux
 * @param {Function} dispatch - Функция Redux для передачи действий через цепочку обработчиков
 * @param {(Object|Function)} action - Действие Redux или функция-асинхронное действие Redux, которое должно быть выполнено
 * @return {Promise|Object} - Результат выполнения вызываемого действия, если оно было асинхронным, или результат передачи действия через цепочку обработчиков
 */
export const thunk =
    (store: Store) =>
    (dispatch: Dispatch) =>
    (action: Action | AsyncAction) => {
        if (typeof action === 'function') {
            return action(dispatch, store.getState);
        }

        return dispatch(action);
    };
