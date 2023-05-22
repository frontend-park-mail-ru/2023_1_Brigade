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
}

interface State {
    oldPassword: Input;
    newPassword: Input;
    repeatPassword: Input;
    isMounted: boolean;
    node?: DumbProfile;
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
        console.log('debug this: ', this);

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
                    // TODO: оправляем запрос на изменения профиля
                    // store.dispatch(createUpdateUserAction(user));
                    // store.dispatch(createUpdateUserAvatarAction(this.image));
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

    // /**
    //  * Показывает, что был введен занятый username
    //  */
    // occupiedUsername() {
    //     if (this.state.isMounted && this.props?.occupiedUsername) {
    //         this.state.domElements.username?.classList.add('data-input--error');
    //         addErrorToClass('occupied-username', usernameErrorTypes);
    //         store.dispatch(createOccupiedUsernameAction(false));
    //     }
    // }

    // /**
    //  * Обрабатывает нажатие кнопки логина
    //  */
    // handleClickSave() {
    //     if (this.state.valid.isValid()) {
    //         const user = {
    //             username: this.state.domElements.username?.value.slice(1),
    //             nickname: this.state.domElements.nickname?.value,
    //             status: this.state.domElements.status?.value,
    //             current_password:
    //                 this.state.domElements.current_password?.value,
    //             new_password: this.state.domElements.new_password?.value,
    //         } as Record<string, unknown>;

    //         store.dispatch(createUpdateUserAction(user));
    //         store.dispatch(createUpdateUserAvatarAction(this.#image));
    //     } else {
    //         this.validateCurrentPassword();
    //         this.validateNewPassword();
    //         this.validateNickname();
    //         this.validateUsername();
    //     }
    // }

    // /**
    //  * Проверяет пользовательский ввод текущего пароля
    //  */
    // validateCurrentPassword() {
    //     this.state.domElements.current_password?.classList.remove(
    //         'data-input--error'
    //     );
    //     addErrorToClass('', passwordErrorTypes);

    //     const { isError, errorClass } = checkPassword(
    //         this.state.domElements.current_password?.value ?? ''
    //     );

    //     if (isError) {
    //         this.state.domElements.current_password?.classList.add(
    //             'data-input--error'
    //         );
    //         addErrorToClass(errorClass, passwordErrorTypes);
    //         if (this.state.valid.currentPasswordIsValid) {
    //             this.state.valid.currentPasswordIsValid = false;
    //         }
    //         return;
    //     }

    //     if (this.state.valid.currentPasswordIsValid === false) {
    //         this.state.valid.currentPasswordIsValid = true;
    //     }
    // }

    // incorrectPassword() {
    //     if (this.state.isMounted && this.props?.incorrectPassword) {
    //         this.state.domElements.current_password?.classList.add(
    //             'data-input--error'
    //         );
    //         addErrorToClass('incorrect-password', passwordErrorTypes);
    //         if (this.state.valid.currentPasswordIsValid) {
    //             this.state.valid.currentPasswordIsValid = false;
    //         }
    //         store.dispatch(createIncorrectPasswordAction(false));
    //     }
    // }

    // /**
    //  * Проверяет пользовательский ввод нового пароля
    //  */
    // validateNewPassword() {
    //     this.state.domElements.new_password?.classList.remove(
    //         'data-input--error'
    //     );
    //     addErrorToClass('', newPasswordErrorTypes);

    //     const { isError, errorClass } = checkNewPassword(
    //         this.state.domElements.new_password?.value ?? ''
    //     );

    //     if (isError) {
    //         this.state.domElements.new_password?.classList.add(
    //             'data-input--error'
    //         );
    //         addErrorToClass(errorClass, newPasswordErrorTypes);
    //         if (this.state.valid.newPasswordIsValid) {
    //             this.state.valid.newPasswordIsValid = false;
    //         }
    //         return;
    //     }

    //     if (this.state.valid.newPasswordIsValid === false) {
    //         this.state.valid.newPasswordIsValid = true;
    //     }
    // }

    // /**
    //  * Проверяет пользовательский ввод имени
    //  */
    // validateNickname() {
    //     this.state.domElements.nickname?.classList.remove('data-input--error');
    //     addErrorToClass('', nicknameErrorTypes);

    //     const { isError, errorClass } = checkNickname(
    //         this.state.domElements.nickname?.value ?? ''
    //     );

    //     if (isError) {
    //         this.state.domElements.nickname?.classList.add('data-input--error');
    //         addErrorToClass(errorClass, nicknameErrorTypes);
    //         if (this.state.valid.nicknameIsValid) {
    //             this.state.valid.nicknameIsValid = false;
    //         }
    //         return;
    //     }

    //     if (this.state.valid.nicknameIsValid === false) {
    //         this.state.valid.nicknameIsValid = true;
    //     }
    // }

    // validateUsername() {
    //     this.state.domElements.username?.classList.remove('data-input--error');
    //     addErrorToClass('', usernameErrorTypes);
    // }
}