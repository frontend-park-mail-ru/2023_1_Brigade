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

        if (this.props.parent) {
            this.node = this.render() as HTMLElement;
            this.props.parent.appendChild(this.node);
            this.componentDidMount();
            this.update.bind(this);
        }
    }

    private headerText: HTMLElement;
    private profileUsername: HTMLElement;
    private profileStatus: HTMLElement;

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

        this.state.header = new Header({
            parent: this.node,
            className: 'header-profile',
        });

        this.state.backButton = new Button({
            parent: document.querySelector('.header-profile') as HTMLElement,
            className: 'profile__header__back-btn button-transparent',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'back-btn',
            }),
            onClick: this.props.backOnClick,
        });
        document.querySelector('.header-profile')?.appendChild(this.headerText);

        this.state.avatar = new Avatar({
            parent: document.querySelector('.profile') as HTMLElement,
            className:
                'profile__avatar profile__avatar-border-radius-50 profile__avatar-L',
            src: this.props.user?.avatar ?? './assets/img/defaultAva.png', // this.props.user.avatar
            alt: 'User avatar',
            caption: `${this.props.user?.email ?? ''}`,
            captionStyle: 'profile__avatar__caption flex col',
            captionBlockStyle: 'profile__avatar__container col',
            onClick: this.props.avatarOnClick,
        });

        const avatarContainer = document.querySelector(
            '.profile__avatar__caption'
        );

        if (avatarContainer) {
            avatarContainer.appendChild(this.profileUsername);
            avatarContainer.appendChild(this.profileStatus);
        }

        this.state.form = new Form({
            parent: document.querySelector('.profile') as HTMLElement,
            className: 'profile__form',
        });

        this.state.unlockBtn = new Button({
            parent: document.querySelector('.profile__form') as HTMLElement,
            className: 'profile__form__unlock-btn button-transparent',
            icon: svgButtonUI.renderTemplate({
                svgClassName: 'unlock-btn',
            }),
            onClick: this.props.unlockOnClick,
        });

        this.state.name = new Input({
            label: 'Почтовый адрес',
            parent: document.querySelector('.profile__form') as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: this.props.user?.email,
            uniqClassName: 'email',
            errors: emailErrorTypes,
        });

        this.state.nickname = new Input({
            label: 'Никнейм',
            parent: document.querySelector('.profile__form') as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: this.props.user?.nickname,
            uniqClassName: 'nickname',
            errors: nicknameErrorTypes,
        });

        this.state.status = new Input({
            label: 'Статус',
            parent: document.querySelector('.profile__form') as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: this.props.user?.status,
            uniqClassName: 'status',
        });

        this.state.oldPassword = new Input({
            label: 'Старый пароль',
            parent: document.querySelector('.profile__form') as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: 'введите старый пароль',
            errors: passwordErrorTypes,
            uniqClassName: 'old-password',
        });

        this.state.newPassword = new Input({
            label: 'Новый пароль',
            parent: document.querySelector('.profile__form') as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: 'введите новый пароль',
            errors: passwordErrorTypes,
            uniqClassName: 'new-password',
        });

        this.state.repeatPassword = new Input({
            label: 'Повторите пароль',
            parent: document.querySelector('.profile__form') as HTMLElement,
            className: 'input-container profile__form__input',
            placeholder: 'повторите пароль',
            errors: confirmPasswordErrorTypes,
            uniqClassName: 'repeat-password',
        });

        this.state.btnList = new List({
            parent: document.querySelector('.profile') as HTMLElement,
            className: 'profile__form__list row',
        });
        this.state.btnList.getNode()?.classList.remove('list');

        this.state.cancelBtn = new Button({
            parent: document.querySelector(
                '.profile__form__list'
            ) as HTMLElement, // .profile__form__list
            label: 'Отмена',
            className:
                'profile__form__btn cancel-btn button-border-radius-S button-M button-primary',
            onClick: this.props.cancelOnClick,
        });

        this.state.saveBtn = new Button({
            parent: document.querySelector(
                '.profile__form__list'
            ) as HTMLElement, // .profile__form__list
            label: 'Сохранить',
            className:
                'profile__form__btn save-btn button-border-radius-S button-M button-primary',
            onClick: this.props.saveOnClick,
        });

        this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
            const prevProps = this.props;
            this.props.user = this.props.hookUser(state);
            this.state.popup = this.props.hookUpdatePopup.bind(this)(
                document.querySelector('.profile-popup') as HTMLElement
            );

            if (this.props !== prevProps || this.state.popup) {
                this.update();
            }
        });

        this.state.isMounted = true;
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        this.headerText.remove();
        this.state?.header?.destroy();
        this.state?.avatar?.destroy();
        this.state?.saveBtn?.destroy();
        this.state?.cancelBtn?.destroy();
        this.state?.btnList?.destroy();
        this.state?.name?.destroy();
        this.state?.nickname?.destroy();
        this.state?.status?.destroy();
        this.state?.form?.destroy();
        this.headerText.remove();
        this.profileUsername.remove();
        this.profileStatus.remove();
    }

    private render() {
        return new DOMParser().parseFromString(template({}), 'text/html').body
            .firstChild;
    }
}
