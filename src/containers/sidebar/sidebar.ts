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
import { List } from '@/uikit/list/list';
import { Button } from '@/uikit/button/button';

interface Props {
    parent: HTMLElement;
}

interface State {
    isMounted: boolean;
    node?: DumbSidebar;
    confirmBtn: Button | null;
    cancelBtn: Button | null;
    btnList: List | null;
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
        this.prevActive = null;

        this.node = this.render() as HTMLElement;
        this.componentDidMount();

        this.state.btnList = null;
        this.state.cancelBtn = null;
        this.state.confirmBtn = null;
    }

    private popup: Popup | undefined | null;
    private prevActive: HTMLElement | undefined | null;

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

    isActive() {
        if (this.prevActive) {
            this.prevActive.removeAttribute('id');
        }

        // if (this.prevActive?.className)

        const items = document.querySelectorAll('.sidebar-header__list__item');
        for (const item of items) {
            if (item === document.activeElement) {
                this.prevActive = item as HTMLElement;
                item.id = 'active-btn';
            }
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.state.node = new DumbSidebar({
            parent: this.node,
            avatar: this.hookAvatar(store.getState()) ?? '',
            avatarOnClick: this.avatarOnClick.bind(this),
            chatsOnClick: this.chatsOnClick.bind(this),
            contactsOnClick: this.contactsOnClick.bind(this),
            logoutOnClick: this.logoutOnClick.bind(this),
            hookAvatar: this.hookAvatar.bind(this),
        });

        this.prevActive = document.querySelector(
            '.sidebar-header__chats-btn'
        ) as HTMLElement;
        if (this.prevActive) {
            this.prevActive.id = 'active-btn';
        }
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        if (this.popup) {
            this.popup?.destroy();
        }

        this.state?.confirmBtn?.destroy();
        this.state?.cancelBtn?.destroy();
        this.state?.btnList?.destroy();

        this.state.isMounted = false;
    }

    hookAvatar(state: StoreState) {
        return state.user?.avatar ?? '';
    }

    avatarOnClick() {
        // this.isActive();
        store.dispatch(createMoveToProfileAction());
    }

    chatsOnClick() {
        this.isActive();
        store.dispatch(createMoveToChatsAction());
    }

    contactsOnClick() {
        this.isActive();
        store.dispatch(createMoveToContactsAction());
    }

    logoutOnClick() {
        const root = document.getElementById('root');
        if (!this.popup) {
            this.popup = new Popup({
                parent: root as HTMLElement,
                title: 'Вы действительно хотите выйти из приложения ?',
                className: 'logout-popup',
            });

            const popContent: HTMLElement | null = document.querySelector(
                '.popup__content'
            ) as HTMLElement;

            if (popContent) {
                this.state.btnList = new List({
                    parent: popContent,
                    className: 'popup__btn-list',
                });

                this.state?.btnList.getNode()?.classList.remove('list');

                this.state.confirmBtn = new Button({
                    parent: this.state.btnList.getNode() as HTMLElement,
                    className: 'popup__btn confirm__btn button-S',
                    label: 'Подтвердить',
                    onClick: () => {
                        store.dispatch(createLogoutAction());
                        this.popup?.destroy();
                        this.popup = null;
                    },
                });

                this.state.cancelBtn = new Button({
                    parent: this.state.btnList.getNode() as HTMLElement,
                    className: 'popup__btn cancel__btn button-S',
                    label: 'Отмена',
                    onClick: () => {
                        this.popup?.destroy();
                        this.popup = null;
                    },
                });
            }
        }
    }
}
