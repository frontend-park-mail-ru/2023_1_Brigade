import '@uikit/inputdropdown/inputdropdown.scss';
import template from '@uikit/inputdropdown/inputdropdown.pug';
import { Component } from '@framework/component';

interface Props {
    parent: HTMLElement;
    className?: string;
    size?: 'S' | 'M' | 'L';
    style?: Record<string, string | number>;
}

interface State {
    isMounted: boolean;
}

export class InputDropdownList extends Component<Props, State> {
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
            console.error('InputDropdownItem is not mounted');
        }
    }

    getNode() {
        return this.node;
    }

    onClick() {}

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.node
            .querySelector('.input-dropdown__list')
            ?.addEventListener('click', this.onClick.bind(this));

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.node
            .querySelector('.input-dropdown__list')
            ?.removeEventListener('click', this.onClick);

        this.state.isMounted = false;
    }

    render() {
        return new DOMParser().parseFromString(
            template({
                ClassName: this.props.className,
            }),
            'text/html'
        ).body.firstChild;
    }
}
