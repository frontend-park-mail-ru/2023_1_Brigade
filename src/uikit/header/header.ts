import '@uikit/header/header.scss';
import template from '@uikit/header/header.pug';
import { Component } from '@framework/component';

interface Props {
    parent: HTMLElement;
    title?: string;
    className?: string;
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
}

interface State {
    parent?: HTMLElement;
    node: HTMLElement | undefined;
}

export class Header extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);
        console.log('header constructor has been called');

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);
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
        return new DOMParser().parseFromString(
            template({
                ClassName: this.props.className ?? '',
                // UserInfo: this.props.userInfo ?? '',
                Title: this.props.title ?? '',
                // ChatInfo: this.props.chatInfo ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
