import { Component } from '@/framework/component';
import template from '@components/new-sidebar/sidebar.pug';
import '@components/new-sidebar/sidebar.scss';
import { Button } from '@uikit/button/button';
import { svgButtonUI } from '../ui/icon/button';
import { store } from '@store/store';
import { Img } from '@/uikit/img/img';

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
    chatsButton: Button;
    contactsButton: Button;
    logoutButton: Button;
}

export class DumbSidebar extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);
        this.state.isMounted = false;

        this.node = this.render() as HTMLElement;
        this.props.parent.appendChild(this.node);
        this.componentDidMount();
        this.update.bind(this);
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

        this.state.avatar = new Img({
            src: this.props.avatar,
            size: 'S',
            alt: 'nickname',
            onClick: this.props.avatarOnClick,
            parent: this.node,
        });

        this.state.chatsButton = new Button({
            parent: this.node,
            className: 'sidebar-header__chats-btn',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'sidebar__chats-icon' ?? '',
            }),
            onClick: this.props.chatsOnClick,
        });

        this.state.contactsButton = new Button({
            parent: this.node,
            className: 'sidebar-header__contacts-btn',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'sidebar__contacts-icon' ?? '',
            }),
            onClick: this.props.contactsOnClick,
        });

        this.state.logoutButton = new Button({
            parent: this.node,
            className: 'sidebar-header__logout-btn',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'logout-btn' ?? '',
            }),
            onClick: this.props.logoutOnClick,
        });

        this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
            const prevProps = this.props;

            this.props.avatar = this.props.hookAvatar(state);

            if (this.props !== prevProps) {
                this.update();
            }
        });

        this.state.isMounted = true;
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