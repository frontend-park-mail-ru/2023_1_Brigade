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
        body: string;
        attachments: {
            url: string;
            name: string;
        }[];
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
    input: HTMLElement | null;
    sendButton: HTMLElement | null;
    emojiButton: HTMLElement | null;
    attachmentButton: HTMLElement | null;
    lastInputPosition: number;
    attachments: Attachment[];

    attachmentFiles: File[];
    attachmentUrls: {
        url: string;
        name: string;
    }[];
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
            attachments: [],

            attachmentFiles: [],
            attachmentUrls: [],
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
        ) as HTMLElement;
        input.textContent = text;
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

        // TODO: отписать
        this.state.input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

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
                            const selection = window.getSelection();
                            const range = selection?.getRangeAt(0);
                            const cursor = range?.startOffset;

                            if (this.state.input && (cursor || cursor === 0)) {
                                this.state.input?.focus();
                                this.state.input.textContent =
                                    this.state.input.textContent?.slice(
                                        0,
                                        cursor
                                    ) +
                                    emoji +
                                    this.state.input.textContent?.slice(cursor);

                                const range = document.createRange();
                                const selection = window.getSelection();
                                range.setStart(
                                    this.state.input?.childNodes[0],
                                    cursor + emoji.length
                                );
                                range.collapse(true);
                                selection?.removeAllRanges();
                                selection?.addRange(range);
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
                                body: '',
                                attachments: [
                                    { url: sticker, name: 'Sticker.webp' },
                                ],
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
        let symbol = e.key;

        if (e.shiftKey && e.key === 'Enter') {
            symbol = '\n';
            if (this.state.input) {
                this.state.input.textContent += symbol;
            }
        } else if (e.key === 'Enter') {
            this.onSend();
            return;
        }

        if (symbol !== '\n' && symbol.length > 1) {
            return;
        }

        if (document.activeElement === this.state.input) {
            return;
        }

        if (this.state.input && symbol !== '\n') {
            this.state.input.textContent += symbol;
        }

        this.state.input?.focus();
        if (this.state.input) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(
                this.state.input.childNodes[0],
                this.state.input.textContent?.length ?? 0
            );
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    }

    async onSend() {
        const text = this.state.input?.textContent ?? '';

        if (
            !text?.trim() &&
            this.state.attachmentFiles.length < 1 &&
            this.state.attachmentUrls.length < 1
        ) {
            return;
        }

        const attachments: { url: string; name: string }[] = [];
        const promises: Promise<any>[] = [];

        this.state.attachmentFiles.forEach(async (attachment) => {
            promises.push(sendImage(attachment));
        });

        Promise.all(promises).then((results) => {
            const statuses = results.map((result) => result.status);
            const bodyes = results.map((result) => result.body);

            Promise.all(bodyes).then((jsonBodyes) => {
                jsonBodyes.forEach((body, index) => {
                    if (statuses[index] === 201) {
                        attachments.push(body);
                    } else {
                        // TODO: ошибка
                    }
                });

                this.state.attachmentUrls.forEach((att) =>
                    attachments.push(att)
                );

                if (!text?.trim() && attachments.length < 1) {
                    // TODO:
                    console.error('Ошибка загрузки файла');
                } else {
                    this.props.onSend({
                        type: MessageTypes.notSticker,
                        body: text,
                        attachments,
                    });
                }

                this.node
                    ?.querySelector('.message-input__attachment')
                    ?.classList.add('message-input__attachment--disabled');
                setTimeout(() => {
                    if (this.state.input) {
                        this.state.input.textContent = '';
                        this.state.attachmentFiles = [];
                        this.state.attachmentUrls = [];
                        this.state.attachments.forEach((attachment) =>
                            attachment.destroy()
                        );
                    }
                }, 150);
            });
        });
    }

    onEmoji() {
        this.node
            ?.querySelector('.message-input__emoji-stickers')
            ?.classList.toggle('message-input__emoji-stickers--disabled');
    }

    onAttachment() {
        const input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', () => {
            const file = input?.files?.[0];
            if (!file) {
                return;
            }

            this.state.attachmentFiles.push(file);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const url = reader.result as string;
                const parent = document.querySelector(
                    '.message-input__attachment'
                ) as HTMLElement;

                const addedAttachment: Attachment = new Attachment({
                    src: { url, name: file.name },
                    onDelete: () => {
                        this.state.attachmentFiles.splice(
                            this.state.attachmentFiles.findIndex(
                                (attachmentFile) => attachmentFile === file
                            ),
                            1
                        );
                        this.state.attachmentUrls.length < 1 &&
                        this.state.attachmentFiles.length < 1
                            ? this.node
                                  ?.querySelector('.message-input__attachment')
                                  ?.classList.add(
                                      'message-input__attachment--disabled'
                                  )
                            : undefined;
                        setTimeout(() => {
                            addedAttachment.destroy();
                        }, 150);
                    },
                    isSticker: MessageTypes.notSticker,
                    parent,
                });

                this.state.attachments.push(addedAttachment);
            };

            this.node
                ?.querySelector('.message-input__attachment')
                ?.classList.remove('message-input__attachment--disabled');
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
        this.state.attachments.forEach((attachment) => attachment.destroy());

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

    setMessage(message: Message) {
        this.node
            ?.querySelector('.message-input__attachment')
            ?.classList.add('message-input__attachment--disabled');
        this.state.attachmentFiles = [];
        this.state.attachmentUrls = [];
        this.state.attachments.forEach((attachment) => attachment.destroy());

        message.attachments.forEach((attachment) => {
            this.state.attachmentUrls.push(attachment);

            const parent = document.querySelector(
                '.message-input__attachment'
            ) as HTMLElement;

            const addedAttachment: Attachment = new Attachment({
                src: { url: attachment.url, name: attachment.name },
                onDelete: () => {
                    this.state.attachmentUrls.splice(
                        this.state.attachmentUrls.findIndex(
                            (attachmentUrl) => attachmentUrl === attachment
                        ),
                        1
                    );
                    this.state.attachmentUrls.length < 1 &&
                    this.state.attachmentFiles.length < 1
                        ? this.node
                              ?.querySelector('.message-input__attachment')
                              ?.classList.add(
                                  'message-input__attachment--disabled'
                              )
                        : undefined;
                    setTimeout(() => {
                        addedAttachment.destroy();
                    }, 150);
                },
                isSticker: MessageTypes.notSticker,
                parent,
            });

            this.state.attachments.push(addedAttachment);
        });

        if (message.attachments.length > 0) {
            this.node
                ?.querySelector('.message-input__attachment')
                ?.classList.remove('message-input__attachment--disabled');
        }

        if (this.state.input) {
            this.state.input.textContent = message.body;
        }
    }

    update() {
        const prevNode = this.node;

        this.componentWillUnmount();
        this.node = this.render() as HTMLElement;
        this.componentDidMount();

        prevNode?.replaceWith(this.node);
    }
}
