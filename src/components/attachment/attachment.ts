import '@components/attachment/attachment.scss';
import template from '@components/attachment/attachment.pug';
import { Component } from '@framework/component';
import { Img } from '@uikit/img/img';
import { store } from '@store/store';
import { FileUi } from '@uikit/file/file';
import { MessageTypes } from '@config/enum';
import { Files } from '@/config/images_urls';
import { Button } from '@/uikit/button/button';
import { svgButtonUI } from '../ui/icon/button';

interface Props {
    src: { url: string; name: string };
    isSticker: MessageTypes;
    hookAttachment?: (
        state: StoreState
    ) => { url: string; name: string } | undefined;
    onDelete?: () => void;
    className?: string;
    style?: Record<string, string | number>;
    parent: HTMLElement;
}

interface State {
    isMounted: boolean;
    attachments: (Img | FileUi)[];
    deleteButton?: Button;
}

export class Attachment extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isMounted: false,
            attachments: [],
        };

        this.update = this.update.bind(this);

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);

        this.unsubscribe = store.subscribe(
            `${this.constructor.name}:${this.props.src}`,
            (state) => {
                if (!this.props.hookAttachment) {
                    return;
                }

                const prevProps = { ...this.props };

                const updatedAttachment = this.props.hookAttachment(state);
                if (!updatedAttachment) {
                    this.destroy();
                    return;
                }

                this.props.src = updatedAttachment;

                if (this.props !== prevProps) {
                    this.update();
                }
            }
        );
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
            this.unsubscribe();
            this.node?.remove();
            this.node = undefined;
        } else {
            console.error(
                'Attachment is not mounted, but you are trying to destroy it'
            );
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        const format = this.props.src.name.split('.').pop();
        switch (format?.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                this.state.attachments?.push(
                    new Img({
                        src: this.props.src.url,
                        borderRadius: '5',
                        size:
                            this.props.hookAttachment &&
                            this.props.isSticker === MessageTypes.notSticker
                                ? 'XL'
                                : 'L',
                        alt: '',
                        parent: this.node,
                    })
                );
                break;

            default:
                const attachment = new Img({
                    src:
                        Files[this.props.src.name.split('.').pop() ?? 'file'] ??
                        Files.file,
                    borderRadius: '5',
                    size: 'S',
                    onClick: () => {
                        const node = attachment.getNode();
                        if (!node) {
                            return;
                        }

                        const link = document.createElement('a');
                        link.href = this.props.src.url;
                        link.download = this.props.src.name;
                        link.click();
                    },
                    parent: this.node,
                });
                this.state.attachments.push(attachment);

                this.state.attachments.push(
                    new FileUi({
                        src: this.props.src,
                        parent: this.node,
                    })
                );
        }

        if (this.state.attachments.length > 0 && this.props.onDelete) {
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
                height: 'auto',
                position: 'absolute',
                top: 0,
                right: 0,
            };

            this.state.deleteButton = new Button({
                icon: svgButtonUI.renderTemplate({ svgClassName: 'cross' }),
                onClick: this.props.onDelete.bind(this),
                style,
                parent: this.node,
            });
        }

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.state.attachments.forEach((attachment) => attachment.destroy());
        this.state.deleteButton?.destroy();

        this.state.isMounted = false;
    }

    render() {
        const className = `${this.props.className ?? ''}`.trim();

        return new DOMParser().parseFromString(
            template({
                className,
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
