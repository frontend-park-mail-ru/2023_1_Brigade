import { Component } from '@framework/component';
import template from '@components/list/list.pug';
import '@components/list/list.scss';

interface Props {
    parent?: HTMLElement;
}

interface State {
    isMounted: boolean;
    parent?: HTMLElement;
    node: HTMLElement | undefined;
}

export class List extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            parent: this.props.parent,
            node: undefined,
            isMounted: false,
        };
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartSignUp is not mounted');
        }
    }

    componentDidMount() {
        if (!this.state.isMounted) {
            this.state.node = this.render() as HTMLElement;

            this.state.parent?.appendChild(this.state.node);
            this.state.isMounted = true;
        }
    }

    componentWillUnmount() {
        if (!this.state.isMounted) {
            this.state.node?.remove();
            this.state.isMounted = false;
        }
    }

    getNode() {
        return this.state.node;
    }

    render() {
        return new DOMParser().parseFromString(template({}), 'text/html').body
            .firstChild;
    }
}
