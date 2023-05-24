import { Component } from '@framework/component';
import { store } from '@/store/store';
import template from '@components/chat-item/chat-item.pug';
import '@components/chat-item/chat-item.scss';
import { smallEllipseIconUI } from '@components/ui/small-ellipse-icon/small-ellipse-icon';

interface Props {
    user?: User; //TODO: убрать
    parent?: HTMLElement;
    onClick?: (e: Event) => void;
    chat?: Chat;
    observe?: string[];
    isCurrent?: boolean;
}

interface State {
    isMounted: boolean;
    parent?: HTMLElement;
    node: HTMLElement | undefined;
    onClick?: (e: Event) => void;
    chatId?: number;
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

        this.unsubscribe = () => {};
        this.update.bind(this);
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartSignUp is not mounted');
        }
    }

    componentDidMount() {
        if (!this.state.isMounted) {
            this.state.node = this.render() as HTMLElement;
            if (this.props.isCurrent) {
                this.state.node.classList.add('is_current');
            }
            this.state.node.addEventListener('click', (e: Event) => {
                this.state.onClick?.(e);
            });

            this.unsubscribe = store.subscribe(
                this.constructor.name + `:${this.state.chatId}`,
                (props: Props) => {
                    let prop = props;
                    this.state.observe?.forEach((item: string) => {
                        prop = prop[item as keyof Props] as Props;
                    });

                    const chats = prop as Chat[];
                    const index = chats.findIndex((chat: { id: number }) => {
                        return chat?.id === this.state.chatId;
                    });

                    if (this.props.chat != chats[index]) {
                        this.props.chat = chats[index];

                        this.update();
                    }
                }
            );

            this.state.parent?.appendChild(this.state.node);
            this.state.isMounted = true;
        }
    }

    componentWillUnmount() {
        if (this.state.isMounted) {
            this.unsubscribe();
            this.state.node?.remove();
            this.state.isMounted = false;
        }
    }

    update() {
        const updatedNode = this.render() as HTMLElement;
        if (this.props.isCurrent) {
            this.state.node?.classList.add('is_current');
        }
        this.state.node?.replaceWith(updatedNode);
        this.state.node = updatedNode;
    }

    render() {
        return new DOMParser().parseFromString(
            template({
                avatar: smallEllipseIconUI.renderTemplate({
                    imgSrc: this.props.chat?.avatar ?? '',
                    altMsg: this.props.chat?.title ?? '',
                }),
                title: this.props.chat?.title,
                lastMessage: this.props.chat?.last_message?.body ?? '',
                id: this.props.chat?.id ? this.props.chat.id - 1 : 0,
            }),
            'text/html'
        ).body.firstChild;
    }
}
