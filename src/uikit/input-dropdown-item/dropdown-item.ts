import '@uikit/input-dropdown-item/dropdown-item.scss';
import template from '@uikit/input-dropdown-item/dropdown-item.pug';
import { Component } from '@framework/component';

interface Props {
    parent: HTMLElement;
    className?: string;
    contact?: User;
    onClick?: () => void;
    size?: 'S' | 'M' | 'L';
    style?: Record<string, string | number>;
}

interface State {
    isMounted: boolean;
}

export class InputDropdownItem extends Component<Props, State> {
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

    onClick() {
        const checkbox = (document.createElement(
            'div'
        ).innerHTML = `<label class="styled-checkbox scale translate style-blue">
        <input checked type="checkbox" />
        <span class="el">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z"></path></svg>
        </span>
        </label>`);
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.node
            .querySelector('.input-dropdown__list__item')
            ?.addEventListener('click', this.onClick.bind(this));

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.node
            .querySelector('.input-dropdown__list__item')
            ?.removeEventListener('click', this.onClick);

        this.state.isMounted = false;
    }

    render() {
        return new DOMParser().parseFromString(
            template({
                ClassName: this.props.className ?? '',
                ImgSrc: this.props.contact?.avatar ?? '',
                Nickname: this.props.contact?.nickname ?? '',
                InputId: this.props.contact?.id ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
