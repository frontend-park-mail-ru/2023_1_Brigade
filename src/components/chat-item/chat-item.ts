import { Component } from '@framework/component';
import { store } from '@/store/store';
import template from '@components/chat-item/chat-item.pug';
import '@components/chat-item/chat-item.scss';
import { smallEllipseIconUI } from '@uikit/small-ellipse-icon/small-ellipse-icon';
import { MessageTypes } from '@/config/enum';

interface Props {
    user?: User; //TODO: убрать
    parent?: HTMLElement;
    onClick: (e: Event) => void;
    chat: Chat;
    observe?: string[];
    isCurrent?: boolean;
}

interface State {
    isMounted: boolean;
    parent?: HTMLElement;
    node: HTMLElement | undefined;
    onClick: (e: Event) => void;
    chatId: number;
    observe?: string[];
}

export class ChatItem extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            parent: this.props.parent,
            node: undefined,
            isMounted: false,
            onClick: this.props.onClick,
            chatId: this.props.chat?.id,
            observe: this.props.observe,
        };

        this.onClick = this.onClick.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);

        this.state.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.state.parent?.appendChild(this.state.node);

        this.unsubscribe = store.subscribe(
            this.constructor.name + `:${this.state.chatId}`,
            (props: StoreState) => {
                let prop = props;
                this.state.observe?.forEach((item: string) => {
                    prop = prop[item as keyof StoreState] as StoreState;
                });

                const chats = prop as Chat[];
                const index = chats?.findIndex((chat: { id: number }) => {
                    return chat?.id === this.state.chatId;
                });

                if (index === -1 || (!index && index !== 0)) {
                    this.destroy();
                    return;
                }

                if (this.props.chat !== chats[index]) {
                    this.props.chat = chats[index];
                    if (this.props.chat.id === props.openedChat?.id) {
                        this.props.isCurrent = true;
                    }

                    this.update();
                }
            }
        );
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
            this.unsubscribe();
            this.state.node?.remove();
            this.state.node = undefined;
        } else {
            console.error('ChatItem is not mounted');
        }
    }

    onClick(e: Event) {
        setTimeout(() => this.state.node?.classList.add('is_current'));
        this.state.onClick(e);
    }

    componentDidMount() {
        if (this.props.isCurrent) {
            this.state.node?.classList.add('is_current');
        } else {
            if (
                this.props.chat.id ==
                parseInt(window.location.pathname.match(/^\/(\d+)$/)?.[1] ?? '')
            ) {
                this.props.isCurrent = true;
                this.state.node?.classList.add('is_current');
            }
        }
        this.state.node?.addEventListener('click', this.onClick);
        this.state.isMounted = true;
    }

    componentWillUnmount() {
        this.state.node?.removeEventListener('click', this.onClick);
        this.state.isMounted = false;
    }

    update() {
        const updatedNode = this.render() as HTMLElement;
        if (this.props.isCurrent) {
            this.state.node?.classList.add('is_current');
        } else {
            this.state.node?.classList.remove('is_current');
        }
        this.state.node?.replaceWith(updatedNode);
        this.state.node = updatedNode;
    }

    render() {
        return new DOMParser().parseFromString(
            template({
                avatar: smallEllipseIconUI.renderTemplate({
                    imgSrc: this.props.chat.avatar,
                    altMsg: this.props.chat.title,
                }),
                title: this.props.chat.title,
                lastMessage:
                    this.props.chat.last_message?.body === undefined || null
                        ? ''
                        : this.props.chat.last_message?.body === ''
                        ? this.props.chat.last_message.type ===
                          MessageTypes.Sticker
                            ? 'Стикер'
                            : this.props.chat.last_message.attachments.length >
                              0
                            ? 'Вложение'
                            : ''
                        : this.props.chat.last_message?.body
                        ? this.props.chat.last_message.body
                        : '',
                id: this.props.chat.id, // ? this.props.chat.id - 1 : 0,
            }),
            'text/html'
        ).body.firstChild;
    }
}
