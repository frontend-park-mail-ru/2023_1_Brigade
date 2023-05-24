/**
 * Создает карту редукторов Redux, где ключом является тип действия, а значением - соответствующий редуктор
 * @param {Array} reducers - Массив объектов, где каждый объект содержит тип действия и соответствующий редуктор
 * @return {Map} - Карта редукторов, где ключом является тип действия, а значением - соответствующий редуктор
 */
export const combineReducers = (
    reducers: {
        type: string;
        reducer: Reducer;
    }[]
) => {
    const reducersMap = new Map<string, Reducer>();
    for (const { type, reducer } of reducers) {
        reducersMap.set(type, reducer);
    }

    return reducersMap;
};
