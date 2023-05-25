import { Component } from '@framework/component';
import template from '@uikit/input/input.pug';
import '@uikit/input/input.scss';

interface Props {
    parent: HTMLElement;
    placeholder?: string;
    className?: string;
    uniqClassName?: string;
    type?: string;
    errors?: ErrorTypes[];
    errorsClassName?: string;
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

export class Input extends Component<Props, State, HTMLInputElement> {
    constructor(props: Props) {
        super(props);

        this.state = {
            parent: this.props?.parent,
            node: this.render() as HTMLInputElement,
        };

        if (this.state.node) {
            console.log('input did mount');
            this.componentDidMount();
            this.state.parent?.appendChild(this.state.node);
        }
    }

    getNode() {
        return this.node;
    }

    destroy() {
        this.componentWillUnmount();
        this.node?.remove();
        this.node = undefined;
    }

    // update() {
    //     if (this.state.isMounted) {
    //         const prevNode = this.node;

    //         this.componentWillUnmount();
    //         this.node = this.render() as HTMLElement;
    //         this.componentDidMount();

    //         prevNode?.replaceWith(this.node);
    //     } else {
    //         console.error('Input is not mounted');
    //     }
    // }

    componentDidMount() {
        if (!this.state.node) {
            return;
        }

        if (this.props.onChange) {
            this.state.node.addEventListener('input', this.props.onChange);
        }

        // подписать input-ы на изменения стора
        // this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
        //     const prevProps = { ...this.props };

        //     if (this.props.incorrectPassword) {
        //         this.props.incorrectPassword();
        //     }

        //     if (this.props.hookUser) {
        //         this.props.user = this.props.hookUser(state);
        //     }

        //     if (this.props.user !== prevProps.user) {
        //         this.update();
        //     }
        // });
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
                Type: this.props.type ?? 'text',
                ErrorsClassName: this.props.errorsClassName ?? '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
