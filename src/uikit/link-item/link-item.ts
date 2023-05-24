import '@uikit/link-item/link-item.scss';
import template from '@uikit/link-item/link-item.pug';
import { Component } from '@framework/component';

interface Props {
    className?: string;
    href?: string;
    text?: string;
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
    parent: HTMLElement;
}

interface State {}

export class Link extends Component<Props, State, HTMLLinkElement> {
    constructor(props: Props) {
        super(props);

        this.node = this.render() as HTMLLinkElement;
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
        return new DOMParser().parseFromString(
            template({
                ClassName: this.props.className,
                Href: this.props.href ?? '',
                Text: this.props.text ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
