import '@components/message-input/message-input.scss';
import template from '@components/message-input/message-input.pug';
import { Component } from '@framework/component';
import { Img } from '@uikit/img/img';
import { svgButtonUI } from '@components/ui/icon/button';
import { MessageTypes } from '@config/enum';
import { Emoji, Stickers } from '@config/images_urls';
import { Button } from '@uikit/button/button';
import { sendImage } from '@utils/api';
import { Attachment } from '@components/attachment/attachment';

interface Props {
    onSend: (message: {
        type: MessageTypes;
        body?: string | undefined;
        image_url?: string | undefined;
    }) => void;
    className?: string;
    style?: Record<string, string | number>;
    parent: HTMLElement;
}

interface State {
    isMounted: boolean;
    icons: string[];
    emojis: Button[];
    stickers: Img[];
    input: HTMLInputElement | null;
    sendButton: HTMLElement | null;
    emojiButton: HTMLElement | null;
    attachmentButton: HTMLElement | null;
    lastInputPosition: number;
    attachment?: Attachment;

    attachmentFile?: File;
}

export class MessageInput extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isMounted: false,
            input: null,
            icons: [],
            emojis: [],
            stickers: [],
            sendButton: null,
            emojiButton: null,
            attachmentButton: null,
            lastInputPosition: 0,
        };

        this.inputFocus = this.inputFocus.bind(this);
        this.update = this.update.bind(this);

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);
    }

    changeText(text: string) {
        const input = this.node?.querySelector(
            '.message-input__text-field__in'
        ) as HTMLInputElement;
        input.value = text;
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
            this.node?.remove();
            this.node = undefined;
        } else {
            console.error('MessageInput is not mounted');
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.state.input = this.node.querySelector(
            '.message-input__text-field__in'
        ) as HTMLInputElement;

        document.addEventListener('keyup', this.inputFocus);

        this.state.emojiButton = this.node.querySelector(
            '.view-chat__add-emoji-sticker'
        );
        this.state.emojiButton?.addEventListener(
            'click',
            this.onEmoji.bind(this)
        );

        this.state.attachmentButton = this.node.querySelector(
            '.view-chat__add-attachment-button'
        );
        this.state.attachmentButton?.addEventListener(
            'click',
            this.onAttachment.bind(this)
        );

        this.state.sendButton = this.node.querySelector(
            '.view-chat__send-message-button'
        );
        this.state.sendButton?.addEventListener(
            'click',
            this.onSend.bind(this)
        );

        const emojiContainer = this.node.querySelector(
            '.message-input__emoji'
        ) as HTMLElement;

        if (emojiContainer) {
            const style = {
                background: 'none',
                border: 'none',
                color: 'inherit',
                font: 'inherit',
                'line-height': 'normal',
                overflow: 'visible',
                padding: 0,
                'text-align': 'inherit',
                'font-size': '1.6rem',
                'margin-bottom': 0,
            };

            Emoji.forEach((emoji) => {
                this.state.emojis.push(
                    new Button({
                        label: emoji,
                        onClick: () => {
                            const cursor = this.state.input?.selectionStart;

                            if (this.state.input && (cursor || cursor === 0)) {
                                this.state.input.value =
                                    this.state.input.value.slice(0, cursor) +
                                    emoji +
                                    this.state.input.value.slice(cursor);

                                this.state.input?.focus();
                                this.state.input?.setSelectionRange(
                                    cursor + emoji.length,
                                    cursor + emoji.length
                                );
                            }
                        },
                        parent: emojiContainer,
                        style,
                    })
                );
            });
        }

        const stickersContainer = this.node.querySelector(
            '.message-input__stickers'
        ) as HTMLElement;

        if (stickersContainer) {
            const style = {
                'margin-bottom': '10px',
                'margin-right': '10px',
            };

            Stickers.forEach((sticker) => {
                this.state.stickers.push(
                    new Img({
                        src: sticker,
                        borderRadius: '5',
                        size: 'S',
                        onClick: () => {
                            this.props.onSend({
                                type: MessageTypes.Sticker,
                                image_url: sticker,
                            });
                        },
                        parent: stickersContainer,
                        style,
                    })
                );
            });
        }

        this.state.isMounted = true;
    }

    inputFocus(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.onSend();
        }

        if (document.activeElement === this.state.input) {
            return;
        }

        this.state.input?.focus();
        this.state.input?.setSelectionRange(
            this.state.input.value.length,
            this.state.input.value.length
        );

        if (e.key.length > 1) {
            return;
        }

        if (this.state.input) {
            this.state.input.value += e.key;
        }
    }

    async onSend() {
        const body = this.state.input?.value;
        let imgUrl = '';

        if (!body?.trim() && !this.state.attachmentFile) {
            return;
        }

        // ? где и как такое лучше делать
        if (this.state.attachmentFile) {
            const { status, body } = await sendImage(this.state.attachmentFile);

            const jsonBody = await body;

            switch (status) {
                case 201:
                    imgUrl = jsonBody;
                    break;
                default:
                // TODO: мб отправлять какие-нибудь логи на бэк? ну и мб высветить страничку, мол вообще хз что, попробуй позже
            }
        }

        this.props.onSend({
            type: MessageTypes.notSticker,
            body,
            image_url: imgUrl,
        });

        if (this.state.input) {
            this.state.input.value = '';
            this.state.attachmentFile = undefined;
            this.state.attachment?.destroy();
            this.node
                ?.querySelector('.message-input__attachment')
                ?.classList.remove('message-input__attachment--show');
        }
    }

    onEmoji() {
        this.node
            ?.querySelector('.message-input__emoji-stickers')
            ?.classList.toggle('message-input__emoji-stickers--show');
    }

    onAttachment() {
        const input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', () => {
            this.state.attachmentFile = input?.files?.[0];

            if (this.state.attachmentFile) {
                const reader = new FileReader();
                reader.readAsDataURL(this.state.attachmentFile);
                reader.onload = () => {
                    const imageUrl = reader.result;
                    const parent = document.querySelector(
                        '.message-input__attachment'
                    ) as HTMLElement;

                    this.state.attachment?.destroy();
                    this.state.attachment = new Attachment({
                        src: imageUrl as string,
                        isSticker: MessageTypes.notSticker,
                        parent,
                    });
                };
            }

            this.node
                ?.querySelector('.message-input__attachment')
                ?.classList.add('message-input__attachment--show');
        });

        input.click();

        this.state.input?.focus();
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        document.removeEventListener('keyup', this.inputFocus);
        this.state.emojiButton?.removeEventListener(
            'click',
            this.onEmoji.bind(this)
        );
        this.state.attachmentButton?.removeEventListener(
            'click',
            this.onAttachment.bind(this)
        );
        this.state.sendButton?.removeEventListener(
            'click',
            this.onSend.bind(this)
        );

        this.state.emojis.forEach((emoji) => emoji.destroy());
        this.state.stickers.forEach((sticker) => sticker.destroy());
        this.state.attachment?.destroy();

        this.state.isMounted = false;
    }

    render() {
        const className = `${this.props.className ?? ''}`.trim();

        this.state.icons.push(
            svgButtonUI.renderTemplate({
                svgClassName: 'view-chat__add-emoji-sticker',
            })
        );

        this.state.icons.push(
            svgButtonUI.renderTemplate({
                svgClassName: 'view-chat__add-attachment-button',
            })
        );

        this.state.icons.push(
            svgButtonUI.renderTemplate({
                svgClassName: 'view-chat__send-message-button',
            })
        );

        return new DOMParser().parseFromString(
            template({
                className,
                icons: this.state.icons,
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
}
