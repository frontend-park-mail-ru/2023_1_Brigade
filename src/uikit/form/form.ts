import '@uikit/form/form.scss';
import template from '@uikit/form/form.pug';
import { Component } from '@framework/component';

interface Props {
    className?: string;
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
    parent: HTMLElement;
}

interface State {}

export class Form extends Component<Props, State, HTMLFormElement> {
    constructor(props: Props) {
        super(props);

        this.node = this.render() as HTMLFormElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);
    }

    destroy() {
        this.componentWillUnmount();
        this.node?.remove();
        this.node = undefined;
    }

    getNode(): Element | undefined {
        return this?.node;
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
                ClassName: this.props.className ?? 'form',
                Style: this.props.style ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
