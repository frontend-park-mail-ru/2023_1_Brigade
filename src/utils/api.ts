import { get, post, deleteSession } from '@services/ajax';
import { config } from '@config/api';

/**
 * implementation request authorization
 */
export const auth = () => {
    return get(
        config.auth,
    )
    .then(({ status, parsedBody }) => {
        switch (status) {
        case 200:
            parsedBody?.then((body) => {
                return {
                    status,
                    body,
                };
            });

            return {
                status,
                body: null,
            };
        case 401:
        case 500:
            return {
                status,
                body: null,
            };
        default:
            return {
                status,
                body: null,
            };
        }
    })
    .catch((error) => {
        return {
            status: 0,
            body: error,
        }
    });
};

/**
 * implementation request login
 */
export const login = (body: anyObject) => {
    return post(
        config.login,
        body,
    )
    .then(({ status, parsedBody }) => {
        switch (status) {
        case 200:
            parsedBody?.then((body) => {
                return {
                    status,
                    body,
                };
            });
            
            return {
                status,
                body: null,
            };
        case 404:
        case 409:
        case 500:
            return {
                status,
                body: null,
            };
        default:
            return {
                status,
                body: null,
            };
        }
    })
    .catch((error) => {
        return {
            status: 0,
            body: error,
        }
    });;
};

/**
 * implementation request registration
 */
export const signUp = (body: anyObject) => {
    return post(
        config.signup,
        body,
    )
    .then(({ status, parsedBody }) => {
        switch (status) {
        case 201:
            parsedBody?.then((body) => {
                return {
                    status,
                    body,
                };
            });
            return {
                status,
                body: null,
            };
        case 400:
        case 409:
        case 500:
            return {
                status,
                body: null,
            };
        default:
            return {
                status,
                body: null,
            };
        }
    })
    .catch((error) => {
        return {
            status: 0,
            body: error,
        }
    });;
};

/**
 * implementation request logout
 */
export const logout = () => {
    return deleteSession(
        config.logout,
    )
    .then(({ status }) => {
        switch (status) {
        case 204:
        case 401:
        case 404:
        case 500:
            return {
                status,
                body: null,
            };
        default:
            return {
                status,
                body: null,
            };
        }
    })
    .catch((error) => {
        return {
            status: 0,
            body: error,
        }
    });;
};