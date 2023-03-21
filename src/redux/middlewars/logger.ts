export const logger = store => dispatch => action => {
    console.log(action.type);
}
