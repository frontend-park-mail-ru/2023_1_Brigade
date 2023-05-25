import { Component } from '@/framework/component';
import { store } from '@/store/store';
import template from '@components/popup/popup.pug';
import '@components/popup/popup.scss';
import { Button } from '@uikit/button/button';
import { List } from '@uikit/list/list';

interface Props {
    parent: HTMLElement;
    title?: string;
    className?: string;
    content?: () => void;
    user?: User;
    hookUser?: (state: StoreState) => User | undefined;
    style?: Record<string, string | number>;
    incorrectPassword?: () => void;
}

interface State {
    isMounted: boolean;
}

export class Popup extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);
        this.state.isMounted = false;

        this.node = this.render() as HTMLElement;
        this.props.parent.appendChild(this.node);
        this.componentDidMount();
        this.update.bind(this);
    }

    hookUser(state: StoreState): User | undefined {
        return state.user ?? undefined;
    }

    getNode() {
        return this.node;
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

    update() {
        if (this.state.isMounted) {
            const prevNode = this.node;

            this.componentWillUnmount();
            this.node = this.render() as HTMLElement;
            this.componentDidMount();

            prevNode?.replaceWith(this.node);
        } else {
            console.error('Popup is not mounted');
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        if (this.props.content) {
            this.props.content();
        }

        this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
            const prevProps = { ...this.props };

            if (this.props.incorrectPassword) {
                this.props.incorrectPassword();
            }

            if (this.props.hookUser) {
                this.props.user = this.props.hookUser(state);
            }

            if (this.props.user !== prevProps.user) {
                this.update();
            }
        });

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
                Title: this.props.title,
                Content: '',
            }),
            'text/html'
        ).body.firstChild;
    }
}
