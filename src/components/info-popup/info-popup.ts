import { Component } from '@/framework/component';
import template from '@components/info-popup/info-popup.pug';
import '@components/info-popup/info-popup.scss';

interface Props {
    content: string;
    parent: HTMLElement;
    className?: string;
    style?: Record<string, string | number>;
}

interface State {
    isMounted: boolean;
}

export class InfoPopup extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);
        this.state.isMounted = false;

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
        this.props.parent.appendChild(this.node);

        setTimeout(
            () => this.node?.classList.remove('info-popup--disabled'),
            1000
        );
        setTimeout(
            () => this.node?.classList.add('info-popup--disabled'),
            7000
        );
        setTimeout(() => this.destroy(), 8000);
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
            this.node?.remove();
            this.node = undefined;
        } else {
            console.error('Popup is not mounted');
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

        this.state.isMounted = false;
    }

    private render() {
        return new DOMParser().parseFromString(
            template({
                ClassName: this.props.className,
                Content: this.props.content,
            }),
            'text/html'
        ).body.firstChild;
    }
}
