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
    confirmBtnText?: string;
    cancelBtnText?: string;
    style?: Record<string, string | number>;
    confirmLogoutOnClick: (e?: Event) => void;
    cancelLogoutOnClick: (e?: Event) => void;
}

interface State {
    isMounted: boolean;
    btnList: List;
    confirmBtn: Button;
    cancelBtn: Button;
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

        this.state.btnList = new List({
            parent: document.querySelector('.popup__content') as HTMLElement,
            className: 'popup__btn-list',
        });
        this.state.btnList.getNode()?.classList.remove('list');

        this.state.confirmBtn = new Button({
            parent: document.querySelector('.popup__btn-list') as HTMLElement,
            className: 'popup__btn confirm__btn button-S',
            label: this.props.confirmBtnText,
            onClick: this.props.confirmLogoutOnClick,
        });

        this.state.cancelBtn = new Button({
            parent: document.querySelector('.popup__btn-list') as HTMLElement,
            className: 'popup__btn cancel__btn button-S',
            label: this.props.cancelBtnText,
            onClick: this.props.cancelLogoutOnClick,
        });

        this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
            const prevProps = this.props;

            if (this.props !== prevProps) {
                this.update();
            }
        });

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.state.confirmBtn.destroy();
        this.state.cancelBtn.destroy();
        this.state.btnList.destroy();

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
