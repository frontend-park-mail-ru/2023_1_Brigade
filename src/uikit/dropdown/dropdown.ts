import '@uikit/dropdown/dropdown.scss';
import template from '@uikit/dropdown/dropdown.pug';
import { Component } from '@framework/component';

interface Props {
    label?: string;
    icon?: string;
    className?: string;
    size?: 'S' | 'M' | 'L';
    style?: Record<string, string | number>;
    left?: number;
    top?: number;
    elements: { label: string; className: string; onClick: () => void }[];
    parent: HTMLElement;
}

interface State {
    isMounted: boolean;
}

export class Dropdown extends Component<Props, State> {
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
            console.error('Dropdown is not mounted');
        }
    }

    getNode() {
        return this.node;
    }

    onClick() {
        this.node
            ?.querySelector('.new-dropdown-menu')
            ?.classList.toggle('new-dropdown-menu-show');
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.node
            .querySelector('.new-dropdown-toggle')
            ?.addEventListener('click', this.onClick.bind(this));

        this.props.elements.forEach((element) => {
            this.node
                ?.querySelector('.' + element.className)
                ?.addEventListener('click', element.onClick);
        });

        if (this.props.left) {
            this.node.style.left = this.props.left + 'px';
        }

        if (this.props.top) {
            this.node.style.top = this.props.top + 'px';
        }

        document.addEventListener('click', this.destroy.bind(this), {
            once: true,
        });

        setTimeout(() => {
            document.addEventListener('contextmenu', this.destroy.bind(this), {
                once: true,
            });
        });

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.node
            .querySelector('.new-dropdown-toggle')
            ?.removeEventListener('click', this.onClick);

        this.state.isMounted = false;
    }

    render() {
        const className = `${this.props.className ?? ''}`.trim();

        return new DOMParser().parseFromString(
            template({
                className,
                elements: this.props.elements,
            }),
            'text/html'
        ).body.firstChild;
    }
}
