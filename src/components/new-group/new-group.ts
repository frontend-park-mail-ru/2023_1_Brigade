import { chatDescriptionErrorTypes, chatNameErrorTypes } from '@/config/errors';
import { Component } from '@/framework/component';
import { store } from '@/store/store';
import { Avatar } from '@/uikit/avatar/avatar';
import { Button } from '@/uikit/button/button';
import { Form } from '@/uikit/form/form';
import { Input } from '@/uikit/input/input';
import { List } from '@/uikit/list/list';
import template from '@components/new-channel/new-channel.pug';
import '@components/new-channel/new-channel.scss';
import { Header } from '@uikit/header/header';
import { svgButtonUI } from '@components/ui/icon/button';

interface Props {
    parent: HTMLElement;
    user?: User;
    contacts?: User[];
    style?: Record<string, string | number>;
    backOnClick?: (e?: Event) => void;
    avatarOnClick?: (e?: Event) => void;
    cancelOnClick?: (e?: Event) => void;
    saveOnClick?: (e?: Event) => void;
    nameOnChange?: (e?: Event) => void;
    descriptionOnChange?: (e?: Event) => void;
    membersOnChange?: (e?: Event) => void;
    channelNameValidate?: (e?: Event) => void;
    channelDescriptionValidate?: (e?: Event) => void;
    hookContacts?: (state: StoreState) => User[] | undefined;
    hookUser?: (state: StoreState) => User | undefined;
}

interface State {
    isMounted: boolean;
    parent?: HTMLElement | undefined;
    header?: Header;
    backButton?: Button;
    avatar?: Avatar;
    form?: Form;
    name?: Input;
    description?: Input;
    membersInput?: Input;
    btnList?: List;
    cancelBtn?: Button;
    saveBtn?: Button;
}

export class DumbGroup extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);
        this.state.isMounted = false;

        this.headerText = null;

        if (this.props.parent) {
            this.node = this.render() as HTMLElement;
            this.props.parent.appendChild(this.node);
            this.componentDidMount();
            this.update.bind(this);
        }
    }

    private headerText: HTMLElement | null;

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
            this.node?.remove();
            this.node = undefined;
        } else {
            console.error('Profile is not mounted');
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
            console.error('Profile is not mounted');
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.headerText = document.createElement('span');
        this.headerText.classList.add('header__title');
        this.headerText.textContent = 'Создание группы';

        this.state.header = new Header({
            parent: this.node,
            className: 'channel__header',
        });

        this.state.backButton = new Button({
            parent: this.state.header.getNode() as HTMLElement,
            className: 'button-transparent channel__header__back-btn flex',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'back-btn',
            }),
            onClick: this.props.backOnClick,
        });
        this.state.header.getNode()?.appendChild(this.headerText);

        this.state.avatar = new Avatar({
            parent: this.node as HTMLElement,
            className:
                'channel__avatar avatar avatar-border-radius-50 avatar-L',
            src: this.props.user?.avatar ?? './assets/img/defaultAva.png',
            alt: 'User avatar',
            onClick: this.props.avatarOnClick,
        });

        this.state.form = new Form({
            parent: this.node as HTMLElement,
            className: 'channel__form',
        });

        this.state.name = new Input({
            parent: this.state.form.getNode() as HTMLElement,
            label: 'Название',
            className: 'input-container channel__form__input',
            placeholder: 'введите название группы',
            uniqClassName: 'channel-name',
            errors: chatNameErrorTypes,
            errorsClassName: 'channel__form__input__errors',
            onChange: this.props.channelNameValidate,
        });

        this.state.description = new Input({
            parent: this.state.form.getNode() as HTMLElement,
            label: 'Описание',
            className: 'input-container channel__form__input',
            placeholder: 'введите описание группы',
            uniqClassName: 'channel-description',
            errors: chatDescriptionErrorTypes,
            errorsClassName: 'channel__form__input__errors',
            onChange: this.props.channelDescriptionValidate,
        });

        this.state.membersInput = new Input({
            parent: this.state.form.getNode() as HTMLElement,
            label: 'Участники',
            className:
                'input-container channel__form__input channel__form__input-members',
            placeholder: 'введите имя участника группы',
            uniqClassName: 'channel-members',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'search-icon',
            }),
            onChange: this.props.membersOnChange,
        });

        // TODO: создать dropdown, который будет append-ится в input.
        // document.crea channel__form__input-members

        this.state.btnList = new List({
            parent: this.state.form.getNode() as HTMLElement,
            className: 'channel__form__list row flex',
        });
        this.state.btnList.getNode()?.classList.remove('list');

        this.state.cancelBtn = new Button({
            parent: this.state.btnList.getNode() as HTMLElement,
            label: 'Отмена',
            className:
                'btn-reset channel__form__btn cancel-btn button-border-radius-S button-M button-primary',
            onClick: this.props.cancelOnClick,
        });

        this.state.saveBtn = new Button({
            parent: this.state.btnList.getNode() as HTMLElement,
            label: 'Сохранить',
            className:
                'btn-reset channel__form__btn save-btn button-border-radius-S button-M button-primary',
            onClick: this.props.saveOnClick,
        });

        this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
            const prevProps = { ...this.props };
            if (this.props.hookContacts) {
                this.props.contacts = this.props.hookContacts(state);
            }

            if (this.props.hookUser) {
                this.props.user = this.props.hookUser(state);
            }

            if (
                this.props.contacts !== prevProps.contacts ||
                this.props.user !== prevProps.user
            ) {
                this.update();
            }
        });

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.headerText?.remove();
        this.state.backButton?.destroy();
        this.state?.header?.destroy();
        this.state.avatar?.destroy();
        this.state.name?.destroy();
        this.state.description?.destroy();
        this.state.cancelBtn?.destroy();
        this.state.saveBtn?.destroy();
        this.state.btnList?.destroy();
        this.state.form?.destroy();
    }

    private render() {
        return new DOMParser().parseFromString(template({}), 'text/html').body
            .firstChild;
    }
}
