import { Component } from '@framework/component';
import template from '@components/title-item/title-item.pug';
import '@components/title-item/title-item.scss';

interface Props {
    parent?: HTMLElement;
    title?: string;
}

interface State {
    isMounted: boolean;
    parent?: HTMLElement;
    node: HTMLElement | undefined;
}

export class TitleItem extends Component<Props, State> {
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
            console.error('TitleItem is not mounted');
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
        if (this.state.isMounted) {
            this.state.node?.remove();
            this.state.isMounted = false;
        }
    }

    render() {
        return new DOMParser().parseFromString(
            template({
                title: this.props.title,
            }),
            'text/html'
        ).body.firstChild;
    }
}
