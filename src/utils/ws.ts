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
                const e = JSON.parse(event.data);
                const cb = subscribers.get(e.chat_id);
                if (cb) {
                    cb(e);
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
                console.log('send:', message);
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

            // Обработчик события получения сообщения от сервера
            ws.onmessage = (event) => {
                const e = JSON.parse(event.data);

                console.log('message:', e);

                if (Notification.permission !== 'granted') {
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
