import { Component } from '@/framework/component';
import template from '@components/about-us/about-us.pug';
import '@components/about-us/about-us.scss';

interface Props {
    parent: HTMLElement;
    style?: Record<string, string | number>;
}

interface State {
    isMounted: boolean;
    parent?: HTMLElement | undefined;
}

export class DumbAboutUs extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);

        if (this.props.parent) {
            this.node = this.render() as HTMLElement;
            this.state.isMounted = true;
            this.state.parent = this.props.parent;
            this.componentDidMount();
            if (this.node) {
                this.props.parent.appendChild(this.node);
            }
        }
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartAboutUs is not mounted');
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.node.remove();
        this.state.isMounted = false;
    }

    private render() {
        return new DOMParser().parseFromString(template({}), 'text/html').body
            .firstChild;
    }
}
