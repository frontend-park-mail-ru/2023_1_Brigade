import { Component } from '@framework/component';
import { DumbProfile } from '@components/new-profile/profile';
import { DYNAMIC } from '@config/config';
import { router } from '@router/createRouter';
import { Popup } from '@components/popup/popup';
import { store } from '@/store/store';
import { createLogoutAction } from '@/actions/authActions';
import { createIncorrectPasswordAction, createUpdateUserAction } from '@/actions/userActions';
import { Input } from '@uikit/input/input';
import { emailErrorTypes, newPasswordErrorTypes, nicknameErrorTypes, passwordErrorTypes, usernameErrorTypes } from '@/config/errors';
import { addErrorToClass, checkEmail, checkNewPassword, checkNickname, checkPassword } from '@/utils/validator';

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
        passwordIsValid: boolean;
        emailIsValid: any;
        currentPasswordIsValid: boolean;
        newPasswordIsValid: boolean;
        nicknameIsValid: boolean;
        isValid: () => boolean | undefined;
    };
    domElements: {
        avatar: HTMLInputElement | null;
        username: HTMLInputElement | null;
        email: HTMLInputElement | null;
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

        this.state.domElements.email = document.querySelector('.email') as HTMLInputElement;
        this.state.domElements.nickname = document.querySelector('.nickname') as HTMLInputElement;
        this.state.domElements.status = document.querySelector('.status') as HTMLInputElement;
        this.state.domElements.current_password = document.querySelector('.old-password') as HTMLInputElement;
        this.state.domElements.new_password = document.querySelector('.new-password') as HTMLInputElement;

        this.state.valid.isValid =  () => {
            return (
                this.state.valid.emailIsValid &&
                this.state.valid.passwordIsValid &&
                this.state.valid.newPasswordIsValid &&
                this.state.valid.nicknameIsValid
            );
        };
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

    hookUser(state: StoreState): User | undefined {
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
            avatarOnClick: this.handleClickAvatar.bind(this),
            unlockOnClick: this.handleUnlockClick.bind(this),
            saveOnClick: this.handleConfirmChanges.bind(this),
            cancelOnClick: this.handleCancelChanges.bind(this),
            backOnClick: this.handleBackClick.bind(this),
            hookUser: this?.hookUser.bind(this),
            hookUpdatePopup: this?.hookPopup.bind(this),
        });
    }

    /**
     *
     * @param popupRoot корень popup-a
     * @returns {Popup | undefined} - созданный popup или обновленный popup или undefined
     */
    hookPopup(popupRoot: HTMLElement): Popup | HTMLElement | undefined {
        if (popupRoot) {
        }

        return undefined;
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

        if (this.state.valid.isValid()) {
            const user = {
                email: (document.querySelector('.email') as HTMLInputElement).value,
                new_avatar_url: store.getState()?.user?.avatar ?? '',
                nickname: (document.querySelector('.nickname') as HTMLInputElement)
                    .value,
                status: (document.querySelector('.status') as HTMLInputElement)
                    .value,
                current_password: (
                    document.querySelector('.old-password') as HTMLInputElement
                ).value,
                new_password: (
                    document.querySelector('.new-password') as HTMLInputElement
                ).value,
            };
    
            const forUpdate = {
                image: this.image,
                user,
            };
    
            store.dispatch(createUpdateUserAction(forUpdate));
    
            this.popup?.destroy();
            this.popup = null;
        }
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
                title: 'Смена пароля',
                confirmBtnText: 'Подтвердить',
                cancelBtnText: 'Отмена',
                className: 'profile-popup',
                confirmLogoutOnClick: () => {
                    if (this.state.valid.isValid()) {
                        const user = {
                            email: (
                                document.querySelector('.email') as HTMLInputElement
                            ).value,
                            new_avatar_url: store.getState()?.user?.avatar ?? '',
                            nickname: (
                                document.querySelector(
                                    '.nickname'
                                ) as HTMLInputElement
                            ).value,
                            status: (
                                document.querySelector(
                                    '.status'
                                ) as HTMLInputElement
                            ).value,
                            current_password: (
                                document.querySelector(
                                    '.old-password'
                                ) as HTMLInputElement
                            ).value,
                            new_password: (
                                document.querySelector(
                                    '.new-password'
                                ) as HTMLInputElement
                            ).value,
                        };

                        store.dispatch(
                            createUpdateUserAction({ image: this.image, user })
                        );

                        this.popup?.destroy();
                        this.popup = null;
                    }
                },

                cancelLogoutOnClick: () => {
                    this.popup?.destroy();
                    this.popup = null;
                },
            });
        }
    }

    /**
     * Обрабатывает нажатие кнопки назад
     */
    handleBackClick() {
        router.route('/');
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

    /**
     * Проверяет пользовательский ввод текущего пароля
     */
    validateCurrentPassword() {
        this.state.domElements.current_password?.classList.remove(
            'data-input--error'
        );
        addErrorToClass('', passwordErrorTypes);

        const { isError, errorClass } = checkPassword(
            this.state.domElements.current_password?.value ?? ''
        );

        if (isError) {
            this.state.domElements.current_password?.classList.add(
                'data-input--error'
            );
            addErrorToClass(errorClass, passwordErrorTypes);
            if (this.state.valid.currentPasswordIsValid) {
                this.state.valid.currentPasswordIsValid = false;
            }
            return;
        }

        if (this.state.valid.currentPasswordIsValid === false) {
            this.state.valid.currentPasswordIsValid = true;
        }
    }

    incorrectPassword() {
        if (this.state.isMounted && this.props?.incorrectPassword) {
            this.state.domElements.current_password?.classList.add(
                'data-input--error'
            );
            addErrorToClass('incorrect-password', passwordErrorTypes);
            if (this.state.valid.currentPasswordIsValid) {
                this.state.valid.currentPasswordIsValid = false;
            }
            store.dispatch(createIncorrectPasswordAction(false));
        }
    }

    /**
     * Проверяет пользовательский ввод нового пароля
     */
    validateNewPassword() {
        this.state.domElements.new_password?.classList.remove(
            'data-input--error'
        );
        addErrorToClass('', newPasswordErrorTypes);

        const { isError, errorClass } = checkNewPassword(
            this.state.domElements.new_password?.value ?? ''
        );

        if (isError) {
            this.state.domElements.new_password?.classList.add(
                'data-input--error'
            );
            addErrorToClass(errorClass, newPasswordErrorTypes);
            if (this.state.valid.newPasswordIsValid) {
                this.state.valid.newPasswordIsValid = false;
            }
            return;
        }

        if (this.state.valid.newPasswordIsValid === false) {
            this.state.valid.newPasswordIsValid = true;
        }
    }

    /**
     * Проверяет пользовательский ввод имени
     */
    validateNickname() {
        this.state.domElements.nickname?.classList.remove('data-input--error');
        addErrorToClass('', nicknameErrorTypes);

        const { isError, errorClass } = checkNickname(
            this.state.domElements.nickname?.value ?? ''
        );

        if (isError) {
            this.state.domElements.nickname?.classList.add('data-input--error');
            addErrorToClass(errorClass, nicknameErrorTypes);
            if (this.state.valid.nicknameIsValid) {
                this.state.valid.nicknameIsValid = false;
            }
            return;
        }

        if (this.state.valid.nicknameIsValid === false) {
            this.state.valid.nicknameIsValid = true;
        }
    }

    /**
     * Проверяет пользовательский ввод почты
     */
    validateEmail() {
        this.state.domElements.email?.classList.remove(
            'login-reg__input_error'
        );
        addErrorToClass('', emailErrorTypes);

        const { isError, errorClass } = checkEmail(
            this.state.domElements.email?.value ?? ''
        );

        if (isError) {
            this.state.domElements.email?.classList.add(
                'login-reg__input_error'
            );
            addErrorToClass(errorClass, emailErrorTypes);
            if (this.state.valid.emailIsValid) {
                this.state.valid.passwordIsValid = false;
            }
            return;
        }

        if (this.state.valid.emailIsValid === false) {
            this.state.valid.emailIsValid = true;
        }
    }
}
