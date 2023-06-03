import '@components/message/message.scss';
import template from '@components/message/message.pug';
import { Component } from '@framework/component';
import { Img } from '@uikit/img/img';
import { MessageTypes } from '@config/enum';
import { store } from '@store/store';
import { Dropdown } from '@uikit/dropdown/dropdown';
import { ROOT } from '@config/config';
import { Attachment } from '../attachment/attachment';

interface Props {
    message: Message;
    hookMessage: (state: StoreState) => Message | undefined;
    user?: User;
    hookUser?: (state: StoreState) => User | undefined;
    place: 'left' | 'right';
    className?: string;
    style?: Record<string, string | number>;
    onDelete?: (message: DumbMessage) => void;
    onEdit?: (message: DumbMessage) => void;
    parent: HTMLElement;
}

interface State {
    avatar?: Img;
    attachment?: Attachment;
}

export class DumbMessage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.props.parent.insertBefore(this.node, this.props.parent.firstChild);

        this.unsubscribe = store.subscribe(
            `${this.constructor.name}:${this.props.message.id}`,
            (state) => {
                const prevProps = { ...this.props };

                const updatedMessage = this.props.hookMessage(state);
                if (!updatedMessage) {
                    this.destroy();
                    return;
                }

                this.props.message = updatedMessage;
                if (this.props.user && this.props.hookUser) {
                    this.props.user = this.props.hookUser(state);
                }

                if (this.props !== prevProps) {
                    this.update();
                }
            }
        );

        this.update.bind(this);
    }

    destroy() {
        this.componentWillUnmount();
        this.unsubscribe();
        this.node?.remove();
        this.node = undefined;
    }

    getMessage() {
        return this.props.message;
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        if (this.props.user) {
            const messageAvatar = this.node.querySelector(
                '.message__avatar'
            ) as HTMLElement;

            if (messageAvatar) {
                this.state.avatar = new Img({
                    src: this.props.user.avatar,
                    borderRadius: '50',
                    size: 'S',
                    alt: this.props.user.nickname,
                    parent: messageAvatar,
                });
            }
        }

        if (this.props.message.attachments.length > 0) {
            const messageImage = this.node.querySelector(
                '.message__image'
            ) as HTMLElement;

            this.props.message.attachments.forEach((attachment) => {
                if (messageImage) {
                    this.state.attachment = new Attachment({
                        src: attachment,
                        isSticker: this.props.message.type,
                        parent: messageImage,
                    });
                }
            });
        }

        if (this.props.place === 'left') {
            return;
        }

        this.node.addEventListener('contextmenu', (event) => {
            event.preventDefault();

            this.onRightClick(event);
        });
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.state.avatar?.destroy();
        this.state.attachment?.destroy();

        this.node.removeEventListener('contextmenu', this.onRightClick);
    }

    render() {
        const className = `${this.props.className ?? ''} message__${
            this.props.place
        } ${this.props.message.body ? '' : 'message--sticker'}`.trim();

        let imageFlag = false;
        if (this.props?.message?.attachments?.length) {
            imageFlag = this.props?.message?.attachments?.length > 0;
        }

        return new DOMParser().parseFromString(
            template({
                id: this.props.message.id,
                className,
                style: this.props.style ?? '',
                nickname: this.props.user?.nickname ?? '',
                avatar: this.props.user?.avatar ?? '',
                body: this.props.message.body,
                image: imageFlag,
            }),
            'text/html'
        ).body.firstChild;
    }

    update() {
        const prevNode = this.node;

        this.componentWillUnmount();
        this.node = this.render() as HTMLElement;
        this.componentDidMount();

        prevNode?.replaceWith(this.node);
    }

    onRightClick(event: MouseEvent) {
        new Dropdown({
            className: 'new-dropdown--show',
            parent: ROOT(),
            elements:
                this.props.message.type === MessageTypes.notSticker
                    ? [
                          {
                              className: 'edit-message',
                              label: 'Изменить',
                              onClick: this.onEdit.bind(this),
                          },
                          {
                              className: 'delete-message',
                              label: 'Удалить',
                              onClick: this.onDelete.bind(this),
                          },
                      ]
                    : [
                          {
                              className: 'delete-message',
                              label: 'Удалить',
                              onClick: this.onDelete.bind(this),
                          },
                      ],
            left: event.pageX,
            top: event.pageY,
        });

        this.node?.classList.add('message--pressed');
        document.addEventListener(
            'click',
            () => this.node?.classList.remove('message--pressed'),
            {
                once: true,
            }
        );

        setTimeout(() => {
            document.addEventListener(
                'contextmenu',
                () => this.node?.classList.remove('message--pressed'),
                {
                    once: true,
                }
            );
        });
    }

    onDelete() {
        this.props?.onDelete?.(this);
    }

    onEdit() {
        this.props?.onEdit?.(this);
    }
}
