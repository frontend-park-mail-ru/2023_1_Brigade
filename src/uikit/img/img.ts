import '@uikit/img/img.scss';
import template from '@uikit/img/img.pug';
import { Component } from '@framework/component';

interface Props {
    src: string;
    className?: string;
    borderRadius?: '50' | '25' | '10' | '5';
    size?: 'S' | 'M' | 'L' | 'XL';
    alt?: string;
    caption?: string;
    captionStyle?: string;
    captionBlockStyle?: string;
    figureFlexDirection?: 'row' | 'column';
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
    parent: HTMLElement;
}

interface State {
    isMounted: boolean;
}

export class Img extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);
        this.state.isMounted = false;

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
            this.node?.remove();
            this.node = undefined;
        } else {
            console.error('uikit Img is not mounted');
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        if (this.props.onClick) {
            this.node.addEventListener('click', this.props.onClick);
        }

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        if (this.props.onClick) {
            this.node.removeEventListener('click', this.props.onClick);
        }

        this.state.isMounted = false;
    }

    render() {
        const ClassName = `${this.props.className ?? ''} ${
            this.props.borderRadius
                ? 'image-border-radius-' + this.props.borderRadius
                : ''
        } ${this.props.size ? 'image-' + this.props.size : ''} ${
            this.props.onClick ? 'image--pointer' : ''
        }`.trim();

        const CaptionBlockStyle = `${this.props.captionBlockStyle} ${
            this.props.figureFlexDirection
                ? 'figure-' + this.props.figureFlexDirection
                : ''
        }`.trim();

        return new DOMParser().parseFromString(
            template({
                Src: this.props.src,
                ClassName,
                Alt: this.props.alt ?? '',
                Caption: this.props.caption ?? '',
                CaptionStyle: this.props.captionStyle ?? '',
                CaptionBlockStyle,
                style: this.props.style,
            }),
            'text/html'
        ).body.firstChild;
    }
}
