import { Component } from '@/framework/component';
import template from '@uikit/list/list.pug';
import '@uikit/list/list.scss';

interface Props {
    className?: string;
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
    parent: HTMLElement;
}

interface State {}

export class List extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);
    }

    destroy() {
        this.componentWillUnmount();
        this.node?.remove();
        this.node = undefined;
    }

    getNode() {
        return this.node;
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

    private render() {
        return new DOMParser().parseFromString(
            template({
                ClassName: this.props.className ?? '',
                Style: this.props.style ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
