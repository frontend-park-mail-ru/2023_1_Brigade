import renderChat from './render-chat.js';
import renderAuth from './render-auth.js';
import renderReg from './render-reg.js';
import renderLogin from './render-login.js';
import renderError from './render-error.js';

export default {
    auth: {
        href: '/auth/',
        render: renderAuth,
        key: 'auth',
    },
    login: {
        href: '/login/',
        render: renderLogin,
        key: 'login',
    },
    reg: {
        href: '/signup/',
        render: renderReg,
        key: 'signup',
    },
    chat: {
        href: '/users/',
        render: renderChat,
        key: 'chat',
    },
    error: {
        href: '/error/',
        render: renderError,
        key: 'error',
    },
    logout: {
        href: '/logout/',
        render: renderChat,
        key: 'logout',
    },
};
