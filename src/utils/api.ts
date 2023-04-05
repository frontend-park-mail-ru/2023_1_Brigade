import { get, post, deleteSession, put } from '@services/ajax';
import { config } from '@config/api';
import * as timers from "timers";

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
            return {
                status,
                body: parsedBody,
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
            return {
                status,
                body: parsedBody,
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
    });
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
            return {
                status,
                body: parsedBody,
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
    });
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
    });
};

/**
 * implementation request update user profile
 */
export const updateUser = (body: anyObject) => {
    return put(
        config.updateUser,
        body,
    )
    .then(({ status, parsedBody }) => {
        switch (status) {
        case 200:
            return {
                status,
                body: parsedBody,
            };
        case 400:
        case 401:
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
    });
};

/**
 * implementation request contacts
 */
export const contacts = () => {
    return get(
        config.contacts,
    )
        .then(({ status, parsedBody }) => {
            switch (status) {
                case 200:
                    return {
                        status,
                        body: parsedBody,
                    };
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
        });
};

export const createGroup = (body: anyObject) => {
    return post(
        config.createGroup,
        body,
    )
        .then(({ status, parsedBody }) => {
            switch (status) {
                case 201:
                    return {
                        status,
                        body: parsedBody,
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
        });
};
