import { store } from '@/store/store';

const createWs = (url: string) => {
    let ws: WebSocket | undefined;
    const subscribers = new Map<number, ((message: Message) => void)[]>();

    const create = () => {
        ws = new WebSocket(url);

        ws.onopen = () => {
            if (!ws) {
                return;
            }

            // Обработчик события получения сообщения от сервера
            ws.onmessage = (event) => {
                const e = JSON.parse(event.data);
                const cbs = subscribers.get(e.chat_id);
                if (cbs) {
                    cbs.forEach((cb) => cb(e));
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
                if (subscribers.has(chatId)) {
                    subscribers.get(chatId)?.push(cb);
                } else {
                    subscribers.set(chatId, [cb]);
                }

                return () => {
                    debugger;
                    const index = subscribers
                        .get(chatId)
                        ?.findIndex((c) => c == cb);
                    if (index !== -1) {
                        console.log({ ...subscribers });
                        subscribers.get(chatId)?.slice(index, 1);
                        console.log(subscribers);
                    }
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
