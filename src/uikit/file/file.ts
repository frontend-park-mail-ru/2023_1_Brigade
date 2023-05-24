import '@uikit/file/file.scss';
import template from '@uikit/file/file.pug';
import { Component } from '@framework/component';

interface Props {
    src: { url: string; name: string };
    className?: string;
    style?: Record<string, string | number>;
    parent: HTMLElement;
}

interface State {
    isMounted: boolean;
}

export class FileUi extends Component<Props, State, HTMLElement> {
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
            console.error('uikit File is not mounted');
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

    render() {
        const ClassName = `${this.props.className ?? ''}`.trim();

        return new DOMParser().parseFromString(
            template({
                Src: this.props.src.url,
                Download: this.props.src.name,
                ClassName,
                style: this.props.style,
            }),
            'text/html'
        ).body.firstChild;
    }
}
