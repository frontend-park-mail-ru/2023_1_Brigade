import { Route } from '@router/router';
import { SmartChat } from '@containers/chat/chat';
import { SmartCreateGroup } from '@containers/new-group/new-group';
import { SmartLogin } from '@containers/login/login';
import { SmartProfile } from '@containers/profile/profile';
import { SmartSignUp } from '@containers/signUp/signUp';
import { SmartAddUserInGroup } from '@containers/group/group';
import { SmartCreateChannel } from '@/containers/channel/channel';
import { DYNAMIC } from './config';
import { store } from '@/store/store';

export const routes: Route[] = [
    {
        path: /^\/login$/,
        component: () => {
            return new SmartLogin({});
        },
    },
    {
        path: /^\/signup$/,
        component: () => {
            return new SmartSignUp({});
        },
    },
    {
        path: /^\/profile$/,
        component: () => {
            return new SmartProfile({
                parent: DYNAMIC(),
            });
        },
    },
    {
        path: /^\/create_group$/,
        component: () => {
            return new SmartCreateGroup({
                parent: DYNAMIC(),
                user: store.getState().user,
                contacts: store.getState().contacts,
            });
        },
    },
    {
        path: /^\/create_channel$/,
        component: () => {
            return new SmartCreateChannel({
                parent: DYNAMIC(),
            });
        },
    },
    {
        path: /^\/$/,
        component: () => {
            return new SmartChat({});
        },
    },
    {
        path: /^\/(\d+)$/,
        component: (params: string[] | undefined) => {
            if (params) {
                const props = {
                    chatId: parseInt(params[0]),
                };

                return new SmartChat(props);
            }
        },
    },
    {
        path: /^\/(\d+)\/add$/,
        component: (params: string[] | undefined) => {
            if (params) {
                const props = {
                    chatId: parseInt(params[0]),
                };

                return new SmartAddUserInGroup(props);
            }
        },
    },
];
