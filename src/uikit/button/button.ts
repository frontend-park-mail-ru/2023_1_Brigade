import '@uikit/button/button.scss';
import template from '@uikit/button/button.pug';
import { Component } from '@framework/component';

interface Props {
    label?: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
    type?: 'primary' | 'secondary';
    className?: string;
    size?: 'S' | 'M' | 'L';
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
    parent: HTMLElement;
}

interface State {}

export class Button extends Component<Props, State, HTMLButtonElement> {
    constructor(props: Props) {
        super(props);

        this.node = this.render() as HTMLButtonElement;

        if (this.node && this.props.parent) {
            this.componentDidMount();
            this.props.parent.appendChild(this.node);
        }
    }

    getNode() {
        return this.node;
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
        const className = `${this.props.className ?? ''} ${
            this.props.size ? 'button-' + this.props.size : ''
        } ${this.props.type ? 'button-' + this.props.type : ''}`.trim();

        return new DOMParser().parseFromString(
            template({
                className,
                label: this.props.label ?? '',
                style: this.props.style ?? '',
                icon: this.props.icon ?? '',
                iconPosition: this.props.iconPosition ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
