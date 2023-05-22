export function notify(title: string, message: string, icon: string) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            tag: 'ache-mail',
            body: message,
            icon: icon,
        });
    }
}
