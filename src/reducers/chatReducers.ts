import { constantsOfActions } from '@config/actions';

/**
 * Обрабатывает экшен на установку флага isNotRendered в false
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние
 */
export const reduceIsNotRendered = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.isNotRendered:
            return {
                ...state,
                openedChat: {
                    ...state.openedChat,
                    isNotRendered: false,
                } as OpenedChat,
            };
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на добавление нового чата
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после добавления нового чата
 */
export const reduceAddChat = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.addChat:
            const payload = action.payload as Chat;
            if (action.payload) {
                if (!state.chats) {
                    return {
                        ...state,
                        chats: [payload],
                    };
                }

                state.chats.push(payload);
            }
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на установку значения chats в State
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние
 */
export const reduceSetChats = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.setChats:
            const payload = action.payload as Record<string, Chat[]>;
            return {
                ...state,
                chats: payload.chats as Chat[],
            };
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на открытие нового чата
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после открытия нового чата
 */
export const reduceOpenChat = (state: StoreState, action: Action) => {
    console.log('reduceOpenChat payload:', action.payload);
    switch (action.type) {
        case constantsOfActions.openChat:
            if (action.payload) {
                return {
                    ...state,
                    openedChat: {
                        ...(action.payload as OpenedChat),
                        isNotRendered: true,
                    } as OpenedChat,
                };
            }
            return {
                ...state,
                openedChat: undefined,
            };
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на удаление чата из State
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после удаления чата
 */
export const reduceDeleteChat = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.deleteChat:
            const payload = action.payload as Chat;

            if (payload?.id) {
                state.chats = state.chats?.filter(
                    (chat) => chat.id != payload?.id
                );
            }
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на редактирование чата в State
 * reducer вызывается при сохранения изменений в chat-е
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после редактирования чата
 */
export const reduceEditChat = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.editChat:
            const payload = action.payload as Chat;

            const index = state.chats?.findIndex((chat) => {
                return chat.id == payload.id;
            });

            if ((index && index !== -1) || index === 0) {
                state.chats?.splice(index, 1, {
                    ...state.chats[index],
                    title: payload.title,
                    members: payload.members,
                });
            }

        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на открытие найденных чатов
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после удаления чата
 */
export const reduceSetSearchedChats = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.setSearchedChats:
            if (action.payload) {
                return {
                    ...state,
                    ...(action.payload as Record<string, unknown>),
                };
            }
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на удаление найденных чатов
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после удаления чата
 */
export const reduceDeleteSearchedChats = (
    state: StoreState,
    action: Action
) => {
    switch (action.type) {
        case constantsOfActions.deleteSearchedChats:
            if (action.payload) {
                return {
                    ...state,
                    ...(action.payload as Record<string, unknown>),
                };
            }
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на добавление пользователя в чат
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после удаления чата
 */
export const reduceAddUserInChat = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.addUserInChat:
            const payload = action.payload as User;

            if (payload) {
                state?.openedChat?.members.push(payload);

                if (state.openedChat) {
                    const last_message =
                        state.openedChat.messages[
                            state.openedChat.messages.length - 1
                        ];

                    let last_message_author = {
                        id: 0,
                        username: '',
                        nickname: '',
                        email: '',
                        status: '',
                        avatar: '',
                    } as User;

                    if (last_message) {
                        last_message_author =
                            state.openedChat.members.find((member) => {
                                member.id === last_message.author_id;
                            }) ??
                            ({
                                id: 0,
                                username: '',
                                nickname: '',
                                email: '',
                                status: '',
                                avatar: '',
                            } as User);
                    }

                    state.chats?.push({
                        id: state.openedChat.id,
                        type: state.openedChat.type,
                        title: state.openedChat.title,
                        avatar: state.openedChat.avatar,
                        members: state.openedChat.members,
                        last_message,
                        last_message_author,
                    });
                }
            }
        default:
            return {
                ...state,
            };
    }
};

/**
 * Обрабатывает экшен на добавление пользователя из чата
 *
 * @param {State} state - Текущее состояние
 * @param {Action} action - Экшен
 * @return {object} Обновленное состояние после удаления чата
 */
export const reduceDeleteUserInChat = (state: StoreState, action: Action) => {
    switch (action.type) {
        case constantsOfActions.deleteUserInChat:
            for (let i = 0; i < (state.openedChat?.members.length ?? 0); ++i) {
                if (state.openedChat?.members[i].id === state.user?.id) {
                    state.openedChat?.members.splice(i, 1);
                }
            }

            state.chats = state.chats?.filter(
                (chat: Chat) => chat.id != state.openedChat?.id
            );
        default:
            return {
                ...state,
            };
    }
};
