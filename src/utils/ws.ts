import {
    createAddMessageAction,
    createDeleteMessageAction,
    createEditMessageAction,
} from '@/actions/messageActions';
import { MessageActionTypes } from '@/config/enum';
import { store } from '@/store/store';

const createWs = (url: string) => {
    let ws: WebSocket | undefined;
    const subscribers = new Map<number, (message: Message) => void>();

    const create = () => {
        ws = new WebSocket(url);

        ws.onopen = () => {
            if (!ws) {
                return;
            }

            // Обработчик события получения сообщения от сервера
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                switch (message.action) {
                    case MessageActionTypes.Edit:
                        store.dispatch(createEditMessageAction(message));
                        break;
                    case MessageActionTypes.Delete:
                        store.dispatch(createDeleteMessageAction(message));
                        break;
                    case MessageActionTypes.Create:
                        store.dispatch(createAddMessageAction(message));
                }

                const cb = subscribers.get(message.chat_id);
                if (cb) {
                    cb(message);
                }
            };

            // Обработчик события закрытия соединения
            ws.onclose = () => {
                ws = undefined;
            };

            // Обработчик события ошибки соединения
            ws.onerror = () => {
                ws = undefined;
            };
        };
    };

    return () => {
        if (!ws) {
            create();
        }

        return {
            send: (message: Message) => {
                ws?.send(JSON.stringify(message));
            },
            subscribe: (chatId: number, cb: (message: Message) => void) => {
                subscribers.set(chatId, cb);
                return () => {
                    subscribers.delete(chatId);
                };
            },
            close: () => {
                ws?.close();
            },
        };
    };
};

const createNotificationWs = (url: string) => {
    let ws: WebSocket | undefined;

    const create = () => {
        ws = new WebSocket(url);

        ws.onopen = () => {
            if (!ws) {
                return;
            }

            ws.send('Hello, world!');

            // Обработчик события получения сообщения от сервера
            ws.onmessage = (event) => {
                const e = JSON.parse(event.data);

                if (
                    Notification.permission !== 'granted' ||
                    e.author_id === store.getState().user?.id
                ) {
                    return;
                }

                new Notification(e.chat_name, {
                    tag: 'ache-mail',
                    body: e.author_nickname + ': ' + e.body,
                    icon: e.chat_avatar,
                });
            };

            // Обработчик события закрытия соединения
            ws.onclose = () => {
                ws = undefined;
            };

            // Обработчик события ошибки соединения
            ws.onerror = () => {
                ws = undefined;
            };
        };
    };

    return () => {
        if (!ws) {
            create();
        }

        return {
            close: () => {
                ws?.close();
            },
        };
    };
};

export const getWs = createWs('wss://technogramm.ru/api/v1/message/');
export const getNotificationWs = createNotificationWs(
    'wss://technogramm.ru/api/v1/notification/'
);
