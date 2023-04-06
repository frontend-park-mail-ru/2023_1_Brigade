import { DYNAMIC, ROOT } from "@/config/config";
import { SmartLogin } from "@/containers/login/login";
import { SmartSignUp } from "@/containers/signUp/signUp";
import { SmartProfile } from "@/containers/profile/profile";
import { store } from "@/store/store";

export interface ComponentTemplate {
    componentWillUnmount: Function;
    componentDidMount: Function;
}

export interface Route {
    path: string,
    component: ComponentTemplate | undefined,
}

export interface urlInfo {
    dynamicParams: Object;
}

export interface historyIterator {
    currentIndex: number;
    path: string;
}

export const appRoutes = new Map<string, Route>();
appRoutes.set('/login', { path: '/login', component: new SmartLogin({ ...store.getState(), rootNode: ROOT })})
appRoutes.set('/signup', { path: '/signup', component: new SmartSignUp({ ...store.getState(), rootNode: ROOT })})
appRoutes.set('/profile', { path: '/profile', component: new SmartProfile({ ...store.getState(), rootNode: DYNAMIC })})
appRoutes.set('/', { path: '/', component: new SmartProfile({ ...store.getState(), rootNode: DYNAMIC })})
