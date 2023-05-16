import { Component } from '@framework/component';
import template from '@uikit/input/input.pug';
import '@uikit/input/input.scss';

interface Props {
    parent: HTMLElement;
    placeholder?: string;
    className?: string;
    uniqClassName?: string;
    errors?: ErrorTypes[];
    label?: string;
    caption?: string;
    onChange?: (e?: Event) => void;
    style?: Record<string, string | number>;
    size?: 'S' | 'M' | 'L';
    contentType?: string;
    value?: string;
}

interface State {
    parent?: HTMLElement;
    node: HTMLElement | undefined;
}

export class MobileInput extends Component<Props, State, HTMLInputElement> {
    constructor(props: Props) {
        super(props);

        this.state = {
            parent: this.props?.parent,
            node: this.render() as HTMLInputElement,
        };

        if (this.state.node) {
            this.componentDidMount();
            this.state.parent?.appendChild(this.state.node);
        }
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

        if (this.props.onChange) {
            this.node.addEventListener('input', this.props.onChange);
        }
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        if (this.props.onChange) {
            this.node.removeEventListener('input', this.props.onChange);
        }
    }

    render() {
        return new DOMParser().parseFromString(
            template({
                Placeholder: this.props.placeholder,
                ClassName: this.props.className,
                UniqClassName: this.props.uniqClassName,
                Errors: this.props.errors,
                Label: this.props.label ?? '',
                Caption: this.props.caption ?? '',
                Value: this.props.value ?? '',
                contentType: this.props.contentType ?? '',
                style: this.props.style ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
