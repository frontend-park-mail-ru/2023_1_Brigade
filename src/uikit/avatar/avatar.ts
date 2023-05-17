import '@uikit/avatar/avatar.scss';
import template from '@uikit/avatar/avatar.pug';
import { Component } from '@framework/component';

interface Props {
    src?: string;
    className?: string;
    borderRadius?: '50' | '10' | '25';
    alt?: string;
    caption?: string;
    captionStyle?: string;
    captionBlockStyle?: string;
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
    parent: HTMLElement;
}

interface State {
    parent?: HTMLElement;
    node: HTMLElement | undefined;
}

export class Avatar extends Component<Props, State, HTMLImageElement> {
    constructor(props: Props) {
        super(props);

        this.node = this.render() as HTMLImageElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);
    }

    destroy() {
        this.componentWillUnmount();
        this.node?.remove();
        this.node = undefined;
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        if (this.props.onClick) {
            this.node.addEventListener('click', this.props.onClick);
        }
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        if (this.props.onClick) {
            this.node.removeEventListener('click', this.props.onClick);
        }
    }

    render() {
        // TODO:
        // const className = `${this.props.className ?? ''} ${
        //     this.props.borderRadius ? 'border-radius-' + this.props.borderRadius : ''}`.trim(); // TODO: не нравица
        return new DOMParser().parseFromString(
            template({
                Src: this.props.src ?? '',
                ClassName: this.props.className ?? '',
                Alt: this.props.alt ?? '',
                Caption: this.props.caption ?? '',
                CaptionStyle: this.props.captionStyle ?? '',
                CaptionBlockStyle: this.props.captionBlockStyle ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
