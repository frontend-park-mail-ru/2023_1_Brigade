import '@/index.scss';
import { createAuthAction } from '@actions/authActions';
import { store } from '@store/store';
import { router } from '@router/createRouter';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js')
            .then((registration) => {
                console.log(
                    'ServiceWorker registration successful:',
                    registration
                );
            })
            .catch((err) => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

Notification.requestPermission();

router.start();

store.dispatch(createAuthAction());
