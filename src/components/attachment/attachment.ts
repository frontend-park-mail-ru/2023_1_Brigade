import '@components/attachment/attachment.scss';
import template from '@components/attachment/attachment.pug';
import { Component } from '@framework/component';
import { Img } from '@uikit/img/img';
import { store } from '@store/store';

interface Props {
    attachment: string;
    hookAttachment: (state: StoreState) => string | undefined;
    className?: string;
    style?: Record<string, string | number>;
    parent: HTMLElement;
}

interface State {
    img?: Img;
}

export class Attachment extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);

        this.unsubscribe = store.subscribe(
            `${this.constructor.name}:${this.props.attachment}`,
            (state) => {
                const prevProps = { ...this.props };

                const updatedAttachment = this.props.hookAttachment(state);
                if (!updatedAttachment) {
                    this.destroy();
                    return;
                }

                this.props.attachment = updatedAttachment;

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

    componentDidMount() {
        if (!this.node) {
            return;
        }

        if (parent) {
            this.state.img = new Img({
                src: this.props.attachment,
                borderRadius: '5',
                size: 'XL',
                alt: '',
                parent: this.node,
            });
        }
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.state.img?.destroy();
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
