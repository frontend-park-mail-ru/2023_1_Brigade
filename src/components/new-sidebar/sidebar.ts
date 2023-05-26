import { Component } from '@/framework/component';
import template from '@components/new-sidebar/sidebar.pug';
import '@components/new-sidebar/sidebar.scss';
import { Button } from '@uikit/button/button';
import { svgButtonUI } from '../ui/icon/button';
import { store } from '@store/store';
import { Img } from '@/uikit/img/img';
import { List } from '@uikit/list/list';

interface Props {
    parent: HTMLElement;
    avatar: string;
    style?: Record<string, string | number>;
    avatarOnClick: (e?: Event) => void;
    chatsOnClick: (e?: Event) => void;
    contactsOnClick: (e?: Event) => void;
    logoutOnClick: (e?: Event) => void;
    hookAvatar: (state: StoreState) => string;
}

interface State {
    isMounted: boolean;
    avatar: Img;
    list: List;
    chatsButton: Button;
    contactsButton: Button;
    logoutButton: Button;
}

export class DumbSidebar extends Component<Props, State, HTMLElement> {
    private prevProps: Props | null;

    constructor(props: Props) {
        super(props);
        this.state.isMounted = false;
        this.prevProps = null;
        this.update = this.update.bind(this);

        this.node = this.render() as HTMLElement;
        this.props.parent.appendChild(this.node);

        this.componentDidMount();
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
            this.node?.remove();
            this.node = undefined;
        } else {
            console.error('DumbSidebar is not mounted');
        }
    }

    update() {
        if (this.state.isMounted) {
            const prevNode = this.node;

            this.componentWillUnmount();
            this.node = this.render() as HTMLElement;
            this.componentDidMount();

            prevNode?.replaceWith(this.node);
        } else {
            console.error('DumbSidebar is not mounted');
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.state.list = new List({
            parent: this.node,
            className: 'sidebar-header__list',
        });

        this.state.avatar = new Img({
            parent: this.node.querySelector(
                '.sidebar-header__list'
            ) as HTMLElement,
            className: 'sidebar-header__list sidebar-header__list__item',
            src: this.props.avatar,
            size: 'S',
            alt: 'nickname',
            onClick: this.props.avatarOnClick,
        });

        this.state.chatsButton = new Button({
            parent: this.node.querySelector(
                '.sidebar-header__list'
            ) as HTMLElement,
            className:
                'sidebar-header__chats-btn sidebar-header__list__item button-transparent',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'sidebar__chats-icon' ?? '',
            }),
            onClick: this.props.chatsOnClick,
        });

        this.state.contactsButton = new Button({
            parent: this.node.querySelector(
                '.sidebar-header__list'
            ) as HTMLElement,
            className:
                'sidebar-header__contacts-btn sidebar-header__list__item button-transparent',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'sidebar__contacts-icon' ?? '',
            }),
            onClick: this.props.contactsOnClick,
        });

        this.state.logoutButton = new Button({
            parent: this.node,
            className:
                'sidebar-header__logout-btn sidebar-header__list__item button-transparent',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'logout-btn' ?? '',
            }),
            onClick: this.props.logoutOnClick,
        });

        this.state.isMounted = true;

        this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
            this.prevProps = { ...this.props };
            this.props.avatar = this.props.hookAvatar(state);

            if (this.props.avatar !== this.prevProps.avatar) {
                this.update();
            }
        });
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.state.avatar.destroy();
        this.state.chatsButton.destroy();
        this.state.contactsButton.destroy();
        this.state.logoutButton.destroy();

        this.state.isMounted = false;
    }

    private render() {
        return new DOMParser().parseFromString(template({}), 'text/html').body
            .firstChild;
    }
}
