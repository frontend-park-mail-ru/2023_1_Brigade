import {
    confirmPasswordErrorTypes,
    emailErrorTypes,
    nicknameErrorTypes,
    passwordErrorTypes,
} from '@/config/errors';
import { Component } from '@/framework/component';
import { store } from '@/store/store';
import { Avatar } from '@/uikit/avatar/avatar';
import { Button } from '@/uikit/button/button';
import { Form } from '@/uikit/form/form';
import { Input } from '@/uikit/input/input';
import { List } from '@/uikit/list/list';
import template from '@components/new-profile/profile.pug';
import '@components/new-profile/profile.scss';
import { Header } from '@uikit/header/header';
import { svgButtonUI } from '@components/ui/icon/button';
import { Popup } from '@components/popup/popup';

interface Props {
    parent: HTMLElement;
    user: User | undefined;
    style?: Record<string, string | number>;
    avatarOnClick?: (e?: Event) => void;
    backOnClick?: (e?: Event) => void;
    unlockOnClick?: (e?: Event) => void;
    saveOnClick?: (e?: Event) => void;
    cancelOnClick?: (e?: Event) => void;
    emailOnChange?: (e?: Event) => void;
    nicknameOnChange?: (e?: Event) => void;
    statusOnChange?: (e?: Event) => void;
    oldPasswordOnChange?: (e?: Event) => void;
    newPasswordOnChange?: (e?: Event) => void;
    repeatPasswordOnChange?: (e?: Event) => void;
    hookUpdatePopup: (
        popupRoot: HTMLElement
    ) => Popup | HTMLElement | undefined;
    hookUser: (state: StoreState) => User | undefined;
}

interface State {
    isMounted: boolean;
    parent?: HTMLElement | undefined;
    popup?: Popup | HTMLElement | undefined;
    header?: Header;
    backButton?: Button;
    avatar?: Avatar;
    form?: Form;
    unlockBtn?: Button;
    name?: Input;
    nickname?: Input;
    status?: Input;
    btnList?: List;
    cancelBtn?: Button;
    saveBtn?: Button;
    oldPassword?: Input;
    newPassword?: Input;
    repeatPassword?: Input;
}

export class DumbProfile extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);
        this.state.isMounted = false;

        this.headerText = null;
        this.profileUsername = null;
        this.profileStatus = null;

        if (this.props.parent) {
            this.node = this.render() as HTMLElement;
            this.props.parent.appendChild(this.node);
            this.componentDidMount();
            this.update.bind(this);
        }
    }

    private headerText: HTMLElement | null;
    private profileUsername: HTMLElement | null;
    private profileStatus: HTMLElement | null;

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
            console.log('profile method updated has been called');
            this.componentDidMount();

            console.log('this.node after update: ', this.node);

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
        this.headerText.textContent = 'Редактирование профиля';

        this.profileUsername = document.createElement('span');
        this.profileUsername.classList.add(
            'profile__avatar__caption__username'
        );

        if (this.props.user?.nickname) {
            console.log('nickname: ', this.props.user.nickname);
            this.profileUsername.textContent = this.props.user?.nickname;
        }

        this.profileStatus = document.createElement('span');
        this.profileStatus.classList.add('profile__avatar__caption__status');
        if (this.props.user?.status) {
            this.profileStatus.textContent = this.props.user?.status;
        }

        this.state.header = new Header({
            parent: this.node,
            className: 'header-profile',
        });

        this.state.backButton = new Button({
            parent: this.state.header.getNode() as HTMLElement,
            className: 'profile__header__back-btn button-transparent',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'back-btn',
            }),
            onClick: this.props.backOnClick,
        });
        this.state.header.getNode()?.appendChild(this.headerText);

        this.state.avatar = new Avatar({
            parent: this.node as HTMLElement,
            className:
                'profile__avatar profile__avatar-border-radius-50 profile__avatar-L',
            src: this.props.user?.avatar ?? './assets/img/defaultAva.png', // this.props.user.avatar
            alt: 'User avatar',
            caption: `${this.props.user?.email ?? ''}`,
            captionStyle: 'profile__avatar__caption flex col',
            captionBlockStyle: 'profile__avatar__container col',
            onClick: this.props.avatarOnClick,
        });

        this.state?.avatar?.getNode()?.appendChild(this.profileUsername);
        this.state?.avatar?.getNode()?.appendChild(this.profileStatus);

        this.state.form = new Form({
            parent: this.node as HTMLElement,
            className: 'profile__form',
        });

        this.state.unlockBtn = new Button({
            parent: this.state.form.getNode() as HTMLElement,
            className: 'profile__form__unlock-btn button-transparent',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'unlock-btn',
            }),
            onClick: this.props.unlockOnClick,
        });

        this.state.name = new Input({
            label: 'Почтовый адрес',
            parent: this.state.form.getNode() as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: this.props.user?.email,
            value: this.props.user?.email,
            uniqClassName: 'email',
            errors: emailErrorTypes,
        });

        this.state.nickname = new Input({
            label: 'Никнейм',
            parent: this.state.form.getNode() as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: this.props.user?.nickname,
            value: this.props.user?.nickname,
            uniqClassName: 'nickname',
            errors: nicknameErrorTypes,
        });

        this.state.status = new Input({
            label: 'Статус',
            parent: this.state.form.getNode() as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: this.props.user?.status,
            value: this.props.user?.status,
            uniqClassName: 'status',
        });

        this.state.btnList = new List({
            parent: this.state.form.getNode() as HTMLElement,
            className: 'profile__form__list row',
        });
        this.state.btnList.getNode()?.classList.remove('list');

        this.state.cancelBtn = new Button({
            parent: this.state.btnList.getNode() as HTMLElement,
            label: 'Отмена',
            className:
                'profile__form__btn cancel-btn button-border-radius-S button-M button-primary',
            onClick: this.props.cancelOnClick,
        });

        this.state.saveBtn = new Button({
            parent: this.state.btnList.getNode() as HTMLElement,
            label: 'Сохранить',
            className:
                'profile__form__btn save-btn button-border-radius-S button-M button-primary',
            onClick: this.props.saveOnClick,
        });

        this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
            const prevProps = { ...this.props };
            this.props.user = this.props.hookUser(state);

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

        this.headerText?.remove();
        this.state?.header?.destroy();
        this.state?.avatar?.destroy();
        this.state?.saveBtn?.destroy();
        this.state?.cancelBtn?.destroy();
        this.state?.btnList?.destroy();
        this.state?.name?.destroy();
        this.state?.nickname?.destroy();
        this.state?.status?.destroy();
        this.state?.form?.destroy();
        this.profileUsername?.remove();
        this.profileStatus?.remove();
    }

    private render() {
        return new DOMParser().parseFromString(template({}), 'text/html').body
            .firstChild;
    }
}
