import { Component } from '@framework/component';
import { DumbProfile } from '@components/new-profile/profile';
import { DYNAMIC } from '@config/config';
import { router } from '@router/createRouter';
import { Popup } from '@components/popup/popup';
import { store } from '@/store/store';
import { createLogoutAction } from '@/actions/authActions';
import { createUpdateUserAction, createUpdateUserAvatarAction } from '@/actions/userActions';
import { Input } from '@uikit/input/input';
import { passwordErrorTypes } from '@/config/errors';

interface Props {
    parent: HTMLElement;
    user?: User;
    occupiedUsername?: boolean;
    incorrectPassword?: boolean;
}

interface State {
    oldPassword: Input;
    newPassword: Input;
    repeatPassword: Input;
    isMounted: boolean;
    node?: DumbProfile;
    valid: {
        currentPasswordIsValid: boolean;
        newPasswordIsValid: boolean;
        nicknameIsValid: boolean;
        isValid: () => boolean | undefined;
    };
    domElements: {
        avatar: HTMLInputElement | null;
        username: HTMLInputElement | null;
        nickname: HTMLInputElement | null;
        status: HTMLInputElement | null;
        current_password: HTMLInputElement | null;
        new_password: HTMLInputElement | null;
        saveButton: HTMLInputElement | null;
    };
}

/**
 * Отрисовывает страницу пользователя.
 * Прокидывает actions в стору для изменения данных о пользователе
 */
export class SmartProfile extends Component<Props, State> {
    /**
     * Cохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props: Props) {
        DYNAMIC().innerHTML = '';
        super(props);
        this.state.isMounted = false;
        this.profile = null;

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
    }

    private profile: DumbProfile | null;
    private popup: Popup | undefined | null;
    private image: File | undefined;
    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartProfile is not mounted');
        }
    }

    hookUser(state: StoreState) : User | undefined {
        return state.user ?? undefined;
    }

    render() {
        return this.props.parent;
    }

    /**
     * Навешивает переданные обработчики на валидацию и кнопки
     */
    componentDidMount() {
        if (!this.node) {
            return;
        }

        this.state.node = new DumbProfile({
            parent: this.node,
            user: this.hookUser(store.getState()),
            avatarOnClick: this.handleClickAvatar,
            unlockOnClick: this.handleUnlockClick,
            saveOnClick: this.handleConfirmChanges,
            cancelOnClick: this.handleCancelChanges,
            backOnClick: this.handleBackClick,
            hookUser: this?.hookUser,
            hookUpdatePopup: this?.hookPopup,
        });
    }

    /**
     * 
     * @param popupRoot корень popup-a
     * @returns {Popup | undefined} - созданный popup или обновленный popup или undefined
     */
    hookPopup(popupRoot: HTMLElement) : Popup | HTMLElement | undefined {
        if (popupRoot) {
            this.state.oldPassword = new Input({
                label: 'Почтовый адрес',
                parent: document.querySelector('.profile-popup') as HTMLElement,
                className: 'input-container profile__form__input',
                placeholder: this.props?.user?.email,
                uniqClassName: 'email',
                errors: passwordErrorTypes,
            });

            this.state.newPassword = new Input({
                label: 'Почтовый адрес',
                parent: document.querySelector('.profile-popup') as HTMLElement,
                className: 'input-container profile__form__input',
                placeholder: this.props?.user?.email,
                uniqClassName: 'email',
                errors: passwordErrorTypes,
            });

            this.state.repeatPassword = new Input({
                label: 'Почтовый адрес',
                parent: document.querySelector('.profile-popup') as HTMLElement,
                className: 'input-container profile__form__input',
                placeholder: this.props?.user?.email,
                uniqClassName: 'email',
                errors: passwordErrorTypes,
            });
        }

        return popupRoot;
    }

    /**
     * Удаляет все подписки
     */
    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        if (this.profile) {
            this.profile?.destroy();
        }
        
        this.state.isMounted = false;
    }

    handleConfirmChanges(e?: Event) {
        e?.preventDefault();

        console.log('cur image: ', this.image);
        store.dispatch(createUpdateUserAvatarAction(this.image));
    
        const user = {
            email: (document.querySelector('.email') as HTMLInputElement).value,
            new_avatar_url: store.getState()?.user?.avatar,
            nickname: (document.querySelector('.nickname') as HTMLInputElement).value,
            status: (document.querySelector('.status') as HTMLInputElement).value,
            current_password: (document.querySelector('.old-password') as HTMLInputElement).value,
            new_password: (document.querySelector('.new-password') as HTMLInputElement).value,
        };

        // console.log('user before send: ', user);
        store.dispatch(createUpdateUserAction(user));
        
        this.popup?.destroy();
        this.popup = null;
    }

    handleCancelChanges(e?: Event) {
        e?.preventDefault();
        router.route('/');
    }

    /**
     * Обрабатывает нажатие кнопки поменять пароль
     */
    handleUnlockClick(e?: Event) {
        e?.preventDefault();
        console.log('unlock clicked: ', this.state?.node);

        const root = document.getElementById('root');
        if (!this.popup) {
            this.popup = new Popup({
                parent: root as HTMLElement,
                title: "Смена пароля",
                confirmBtnText: 'Подтвердить',
                cancelBtnText: 'Отмена',
                className: 'profile-popup',
                confirmLogoutOnClick: () => {
                    store.dispatch(createUpdateUserAvatarAction(this.image));

                    const user = {
                        email: (document.querySelector('.email') as HTMLInputElement).value,
                        new_avatar_url: store.getState()?.user?.avatar,
                        nickname: (document.querySelector('.nickname') as HTMLInputElement).value,
                        status: (document.querySelector('.status') as HTMLInputElement).value,
                        current_password: (document.querySelector('.old-password') as HTMLInputElement).value,
                        new_password: (document.querySelector('.new-password') as HTMLInputElement).value,
                    };

                    console.log('user before send: ', user);
                    store.dispatch(createUpdateUserAction(user));

                    this.popup?.destroy();
                    this.popup = null;
                },

                cancelLogoutOnClick: () => {
                    this.popup?.destroy();
                    this.popup = null;
                },
            })
        }
        this.state?.node?.componentDidMount();
    }

    /**
     * Обрабатывает нажатие кнопки назад
     */
    handleBackClick() {
        router.route('/')
    }

    /**
     * Обрабатывает нажатие кнопки аватарки
     */
    handleClickAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.jpg';

        input.addEventListener('change', () => {
            this.image = input?.files?.[0];
            console.log('image after change: ', this.image);
            if (this.image) {
                const reader = new FileReader();
                reader.readAsDataURL(this.image);
                reader.onload = () => {
                    const imageUrl = reader.result;
                    const avatar = document.querySelector(
                        '.profile__avatar'
                    ) as HTMLImageElement;
                    avatar.src = imageUrl as string; 
                };
            }
        });

        input.click();
    }
}