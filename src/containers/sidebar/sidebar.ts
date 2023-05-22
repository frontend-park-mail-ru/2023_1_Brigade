import { Component } from '@framework/component';
import { store } from '@store/store';
import { DumbSidebar } from '@components/new-sidebar/sidebar';
import {
    createMoveToChatsAction,
    createMoveToContactsAction,
    createMoveToProfileAction,
} from '@actions/routeActions';
import { createLogoutAction } from '@actions/authActions';
import { Popup } from '@/components/popup/popup';

interface Props {
    parent: HTMLElement;
}

interface State {
    isMounted: boolean;
    node?: DumbSidebar;
}

/**
 * Отрисовывает чаты.
 * Прокидывает actions стору для создания диалога, удаление диалога, открыть диалог для просмотра
 * Также подписывается на изменения активного диалога и статуса диалога
 */
export class SmartSidebar extends Component<Props, State> {
    /**
     * Сохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props: Props) {
        super(props);
        this.state.isMounted = false;
        this.popup = null;

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
    }

    private popup: Popup | undefined | null;

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartSidebar is not mounted');
        }
    }

    render() {
        return this.props.parent;
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.state.node = new DumbSidebar({
            parent: this.node,
            avatar: this.hookAvatar(store.getState()) ?? '',
            avatarOnClick: this.avatarOnClick,
            chatsOnClick: this.chatsOnClick,
            contactsOnClick: this.contactsOnClick,
            logoutOnClick: this.logoutOnClick,
            hookAvatar: this.hookAvatar,
        });
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        if (this.popup) {
            this.popup?.destroy();
        }

        this.state.isMounted = false;
    }

    hookAvatar(state: StoreState) {
        return state.user?.avatar ?? '';
    }

    avatarOnClick() {
        store.dispatch(createMoveToProfileAction());
    }

    chatsOnClick() {
        store.dispatch(createMoveToChatsAction());
    }

    contactsOnClick() {
        store.dispatch(createMoveToContactsAction());
    }

    logoutOnClick() {
        const root = document.getElementById('root');
        if (!this.popup) {
            this.popup = new Popup({
                parent: root as HTMLElement,
                title: 'Вы действительно хотите выйти из приложения ?',
                confirmBtnText: 'Подтвердить',
                cancelBtnText: 'Отмена',
                className: 'logout-popup',
                confirmLogoutOnClick: () => {
                    store.dispatch(createLogoutAction());
                    this.popup?.destroy();
                    this.popup = null;
                },
                cancelLogoutOnClick: () => {
                    this.popup?.destroy();
                    this.popup = null;
                },
            });
        }
    }
}
