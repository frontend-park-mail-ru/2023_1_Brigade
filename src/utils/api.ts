import {
    get,
    post,
    deleteSession,
    put,
    postMultipartForm,
} from '@services/ajax';
import { config } from '@config/api';

/**
 * Отправляет запрос авторизации и обрабатывает ответ
 * @returns {Promise} - Promise с объектом
 */
export const auth = () => {
    return get(config.auth)
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
            };
        });
};

/**
 * Логинит пользователя
 * @param {Record<string, unknown>} body - Тело запроса с данными пользователя
 * @returns {Promise<{ status: number, body: {} }>} - Промис с объектом, содержащим результат выполнения запроса
 */
export const login = (body: Record<string, unknown>) => {
    return post(config.login, body)
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
            };
        });
};

/**
 * Регистрирует нового пользователя
 * @param {Record<string, unknown>} body - Тело запроса с данными пользователя
 * @returns {Promise<{ status: number, body: {} }>} - Промис с объектом, содержащим результат выполнения запроса
 */
export const signUp = (body: Record<string, unknown>) => {
    return post(config.signup, body)
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
            };
        });
};

/**
 * Разлогинивает пользователя из системы
 * @returns {Promise<{ status: number, body: null }>} - Промис с объектом, содержащим результат выполнения запроса
 */
export const logout = () => {
    return deleteSession(config.logout)
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
            };
        });
};

/**
 * Обновляет данные пользователя
 * @param {Record<string, unknown>} body - Тело запроса
 * @returns {Promise<{ status: number, body: {} }>} - Промис с объектом, содержащим результат выполнения запроса
 */
export const updateUser = (body: Record<string, unknown>) => {
    return put(config.updateUser, body)
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
            };
        });
};

/**
 * Получает контакты
 * @return {Promise<{status: number, body: object|null}>} - Промис с объектом, содержащим результат выполнения запроса
 */
export const getContacts = () => {
    return get(config.contacts)
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
            };
        });
};

/**
 * Создает чат, отправляя запрос POST на URL API сервера
 * @param {Record<string, unknown>} body - объект, содержащий параметры запроса.
 * @returns {Promise<{status: number, body: any}>} - Promise, результат которого - объект со статусом и телом ответа.
 */
export const createChat = (body: Record<string, unknown>) => {
    return post(config.chats, body)
        .then(({ status, parsedBody }) => {
            switch (status) {
                case 201:
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
            };
        });
};

/**
 * Ищет контакты по строке
 * @param {string} string - Строка для поиска
 * @return {Promise<{status: number, body: object|null}>} - Promise, результат которого - объект со статусом и телом ответа.
 */
export const getContactsByString = (string: string) => {
    return get(config.searchContacts + string + '/')
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
            };
        });
};

/**
 * Ищет чаты, выполняя запрос на URL API сервера
 * @param {string} str - строка параметра для поиска чатов.
 * @returns {Promise<{status: number, body: any}>} - Promise, результат которого - объект со статусом и телом ответа.
 */
export const searchChats = (str: string) => {
    return get(config.searchChats + str + '/')
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
            };
        });
};

/**
 * Получает чаты, выполняя запрос на URL API сервера
 * @returns {Promise<{status: number, body: any}>} - Promise, результат которого - объект со статусом и телом ответа.
 */
export const getChats = () => {
    return get(config.chats)
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
            };
        });
};

/**
 * Получает чат, выполняя запрос на URL API сервера
 * @returns {Promise<{status: number, body: any}>} - Promise, результат которого - объект со статусом и телом ответа.
 */
export const getOneChat = (chat: Record<string, number>) => {
    return get(config.chats + `${chat.chatId}/`)
        .then(({ status, parsedBody }) => {
            switch (status) {
                case 200:
                    return {
                        status,
                        body: parsedBody,
                    };
                case 401:
                case 403:
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
            };
        });
};

/**
 * Удаляет чат, выполняя запрос на URL API сервера
 * @returns {Promise<{status: number, body: any}>} - Promise, результат которого - объект со статусом и телом ответа.
 */
export const deleteChat = (deletedId: number) => {
    return deleteSession(config.chats + `${deletedId}/`)
        .then(({ status }) => {
            switch (status) {
                case 204:
                case 401:
                case 403:
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
            };
        });
};

/**
 * Редактирует чат, выполняя запрос на URL API сервера
 * @returns {Promise<{status: number, body: any}>} - Promise, результат которого - объект со статусом и телом ответа.
 */
export const editChat = (body: Record<string, unknown>) => {
    return put(config.chats, body)
        .then(({ status, parsedBody }) => {
            switch (status) {
                case 201:
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
            };
        });
};

/**
 * Загружает аватарку, выполняя запрос на URL API сервера
 * @returns {Promise<{status: number, body: any}>} - Promise, результат которого - объект со статусом и телом ответа.
 */
export const uploadAvatar = (avatar: File) => {
    return postMultipartForm(config.uploadAvatar, avatar)
        .then(({ status, parsedBody }) => {
            switch (status) {
                case 201:
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
            };
        });
};

export const sendImage = (image: File) => {
    return postMultipartForm(config.sendImage, image)
        .then(({ status, parsedBody }) => {
            switch (status) {
                case 201:
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
            };
        });
};

export const chatImage = (image: File) => {
    return postMultipartForm(config.chatAvatar, image)
        .then(({ status, parsedBody }) => {
            switch (status) {
                case 201:
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
            };
        });
};
