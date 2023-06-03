import { Component } from '@framework/component';
import { DumbProfile } from '@components/new-profile/profile';
import { DYNAMIC, ROOT } from '@config/config';
import { router } from '@router/createRouter';
import { Popup } from '@components/popup/popup';
import { store } from '@/store/store';
import {
    createIncorrectPasswordAction,
    createInvalidEmailAction,
    createUpdateUserAction,
} from '@/actions/userActions';
import { Input } from '@uikit/input/input';
import {
    confirmPasswordErrorTypes,
    emailErrorTypes,
    nicknameErrorTypes,
    oldPasswordErrorTypes,
    passwordErrorTypes,
} from '@/config/errors';
import {
    addErrorToClass,
    checkConfirmPassword,
    checkEmail,
    checkNickname,
    checkPassword,
} from '@/utils/validator';
import { List } from '@/uikit/list/list';
import { Button } from '@/uikit/button/button';

interface Props {
    parent: HTMLElement;
    user?: User;
    popup?: Popup | undefined;
    occupiedUsername?: boolean;
    incorrectPassword?: boolean;
    occupiedEmail?: boolean;
}

interface State {
    email?: HTMLInputElement;
    nickname?: HTMLInputElement;
    oldPassword?: Input;
    newPassword?: Input;
    repeatPassword?: Input;
    isMounted: boolean;
    node?: DumbProfile;
    btnList?: List;
    confirmBtn?: Button;
    cancelBtn?: Button;
    valid?: {
        emailIsValid: boolean;
        nicknameIsValid: boolean;
        oldPasswordIsValid: boolean;
        passwordIsValid: boolean;
        confirmPasswordIsValid: boolean;
        isValid: () => boolean | undefined;
        isDefaultValid: () => boolean | undefined;
    };
}

/**
 * Отрисовывает страницу пользователя.
 * Прокидывает actions в стору для изменения данных о пользователе
 */
export class SmartProfile extends Component<Props, State> {
    private popup: Popup | undefined | null;
    private image: File | undefined;

    /**
     * Cохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props: Props) {
        DYNAMIC().innerHTML = '';
        super(props);
        this.state = {
            isMounted: false,
            valid: {
                emailIsValid: false,
                nicknameIsValid: false,
                oldPasswordIsValid: false,
                passwordIsValid: false,
                confirmPasswordIsValid: false,
                isValid: () => {
                    return (
                        this?.state?.valid?.passwordIsValid &&
                        this.state.valid.confirmPasswordIsValid &&
                        this.state.valid.oldPasswordIsValid
                    );
                },
                isDefaultValid: () => {
                    return (
                        this?.state?.valid?.emailIsValid &&
                        this.state.valid.nicknameIsValid
                    );
                },
            },
        };

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
    }

    render() {
        return this.props.parent;
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartProfile is not mounted');
        }
    }

    /**
     * Навешивает переданные обработчики на валидацию и кнопки
     */
    componentDidMount() {
        if (!this.node) {
            return;
        }

        if (this.state.isMounted === false) {
            this.state.isMounted = true;
        }

        this.state.node = new DumbProfile({
            parent: this.node,
            user: this.hookUser(store.getState()),
            avatarOnClick: this.avatarOnClick.bind(this),
            unlockOnClick: this.unlockOnClick.bind(this),
            saveOnClick: this.saveOnClick.bind(this),
            cancelOnClick: this.cancelOnClick.bind(this),
            backOnClick: this.backOnClick.bind(this),
            hookUser: this?.hookUser.bind(this),
            emailValidate: this.validateEmail.bind(this),
            nicknameValidate: this.validateNickname.bind(this),
        });

        this.state.email = document.querySelector('.email') as HTMLInputElement;
        this.state.nickname = document.querySelector(
            '.nickname'
        ) as HTMLInputElement;

        this.validateEmail();
        this.validateNickname();
    }

    /**
     * Удаляет все подписки
     */
    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        if (this.state.node) {
            this.state.node.destroy();
        }

        this.state.isMounted = false;
    }

    hookUser(state: StoreState): User | undefined {
        return state.user ?? undefined;
    }

    createPopupContent() {
        const content: HTMLElement | null = document.querySelector(
            '.popup__content'
        ) as HTMLElement;
        if (content) {
            this.state.oldPassword = new Input({
                label: 'Старый пароль',
                parent: content as HTMLElement,
                className: 'input-container profile__form__input',
                placeholder: 'введите старый пароль',
                errors: oldPasswordErrorTypes,
                errorsClassName: 'profile__input__errors',
                uniqClassName: 'old-password',
                type: 'password',
                onChange: (e) => {
                    e?.preventDefault();

                    this.validateOldPassword.bind(this)();
                },
            });

            this.state.newPassword = new Input({
                label: 'Новый пароль',
                parent: content as HTMLElement,
                className: 'input-container profile__form__input',
                placeholder: 'введите новый пароль',
                errors: passwordErrorTypes,
                errorsClassName: 'profile__input__errors',
                uniqClassName: 'new-password',
                type: 'password',
                onChange: (e) => {
                    e?.preventDefault();

                    this.validatePassword.bind(this)();
                },
            });

            this.state.repeatPassword = new Input({
                label: 'Повторите пароль',
                parent: content as HTMLElement,
                className: 'input-container profile__form__input',
                placeholder: 'повторите пароль',
                errors: confirmPasswordErrorTypes,
                errorsClassName: 'profile__input__errors',
                uniqClassName: 'repeat-password',
                type: 'password',
                onChange: (e) => {
                    e?.preventDefault();

                    this.validateConfirmPassword.bind(this)();
                },
            });

            this.state.btnList = new List({
                parent: content as HTMLElement,
                className: 'popup__btn-list',
            });
            this.state.btnList.getNode()?.classList.remove('list');

            this.state.confirmBtn = new Button({
                parent: document.querySelector(
                    '.popup__btn-list'
                ) as HTMLElement,
                className: 'popup__btn confirm__btn button-S',
                label: 'Подтвердить',
                onClick: () => {
                    if (this.state?.valid?.isValid()) {
                        this.updateUserPassword.bind(this)();
                    } else {
                        this.validateOldPassword.bind(this)();
                        this.validatePassword.bind(this)();
                        this.validateConfirmPassword.bind(this)();
                    }
                },
            });

            this.state.cancelBtn = new Button({
                parent: document.querySelector(
                    '.popup__btn-list'
                ) as HTMLElement,
                className: 'popup__btn cancel__btn button-S',
                label: 'Отмена',
                onClick: () => {
                    this.popup?.destroy();
                    this.popup = null;
                },
            });
        }
    }

    updateUserPassword() {
        const user = {
            email: '',
            new_avatar_url: '',
            nickname: '',
            status: '',
            current_password: (
                document.querySelector('.old-password') as HTMLInputElement
            ).value,
            new_password: (
                document.querySelector('.new-password') as HTMLInputElement
            ).value,
        };

        const updateUserPromise = new Promise((resolve) => {
            resolve(
                store.dispatch(
                    createUpdateUserAction({
                        image: this.image,
                        user,
                    })
                )
            );
        });

        updateUserPromise
            .then(() => {
                const oldPasswordIsIncorrect =
                    store.getState().incorrectPassword;
                if (oldPasswordIsIncorrect) {
                    document
                        .querySelector('.old-password')
                        ?.classList.add('login-reg__input_error');

                    addErrorToClass(
                        'incorrect-old-password',
                        oldPasswordErrorTypes
                    );
                    store.dispatch(createIncorrectPasswordAction(false));
                } else if (this.state.valid) {
                    this.state.valid.oldPasswordIsValid = true;
                    store.dispatch(createIncorrectPasswordAction(false));

                    this.popup?.destroy();
                    this.popup = null;
                }
            })
            .catch((error) => {
                console.error('update user error: ', error);
            });
    }

    saveOnClick(e?: Event) {
        e?.preventDefault();

        if (this.state.valid?.isDefaultValid()) {
            const user = {
                email: (document.querySelector('.email') as HTMLInputElement)
                    .value,
                new_avatar_url: store.getState()?.user?.avatar ?? '',
                nickname: (
                    document.querySelector('.nickname') as HTMLInputElement
                ).value,
                status: (document.querySelector('.status') as HTMLInputElement)
                    .value,
                current_password: '',
                new_password: '',
            };

            const forUpdate = {
                image: this.image,
                user,
            };

            // TODO: сделать все что ниже асинхронной функцией
            const updateUserPromise = new Promise((resolve) => {
                resolve(store.dispatch(createUpdateUserAction(forUpdate)));
            });

            updateUserPromise
                .then(() => {
                    const occupiedEmail = store.getState().occupiedEmail;
                    if (occupiedEmail) {
                        document
                            .querySelector('.email')
                            ?.classList.add('login-reg__input_error');

                        addErrorToClass('occupied-email', emailErrorTypes);
                        store.dispatch(createInvalidEmailAction(false));
                    } else if (this.state.valid) {
                        this.state.valid.oldPasswordIsValid = true;
                        store.dispatch(createInvalidEmailAction(false));
                    }
                })
                .catch((error) => {
                    console.error('update user error: ', error);
                });
        }
    }

    cancelOnClick(e?: Event) {
        e?.preventDefault();
        router.route('/');
    }

    /**
     * Обрабатывает нажатие кнопки поменять пароль
     */
    unlockOnClick(e?: Event) {
        e?.preventDefault();

        if (!this.popup) {
            this.popup = new Popup({
                parent: ROOT() as HTMLElement,
                title: 'Смена пароля',
                className: 'profile-popup',
                content: this.createPopupContent.bind(this),
            });
        }
    }

    /**
     * Обрабатывает нажатие кнопки назад
     */
    backOnClick(e?: Event) {
        e?.preventDefault();

        router.route('/');
    }

    /**
     * Обрабатывает нажатие кнопки аватарки
     */
    avatarOnClick(e?: Event) {
        e?.preventDefault();

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.addEventListener('change', () => {
            this.image = input?.files?.[0];
            if (!this.image) {
                return;
            }

            if (this.image.size > 16 * 1024 * 1024) {
                console.error('File size > 16MB');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(this.image);
            reader.onload = () => {
                const imageUrl = reader.result;
                const avatar = document.querySelector(
                    '.profile__avatar'
                ) as HTMLImageElement;
                avatar.src = imageUrl as string;
            };
        });

        input.click();
    }

    /**
     * Проверяет пользовательский ввод почты
     */
    validateEmail(e?: Event) {
        e?.preventDefault();

        this.state.email?.classList.remove('login-reg__input_error');
        addErrorToClass('', emailErrorTypes);

        const { isError, errorClass } = checkEmail(
            (document.querySelector('.email') as HTMLInputElement).value ?? ''
        );

        if (isError) {
            this.state.email?.classList.add('login-reg__input_error');
            addErrorToClass(errorClass, emailErrorTypes);
            if (this.state.valid?.emailIsValid) {
                this.state.valid.emailIsValid = false;
            }

            return;
        }

        if (this.state.valid?.emailIsValid === false) {
            this.state.valid.emailIsValid = true;
        }
    }

    /**
     * Проверяет пользовательский ввод имени
     */
    validateNickname(e?: Event) {
        e?.preventDefault();
        this.state.nickname?.classList.remove('login-reg__input_error');
        addErrorToClass('', nicknameErrorTypes);

        const { isError, errorClass } = checkNickname(
            (document.querySelector('.nickname') as HTMLInputElement).value ??
                ''
        );

        if (this.state.valid) {
            this.state.valid.nicknameIsValid = true;
        }

        if (isError) {
            this.state.nickname?.classList.add('login-reg__input_error');
            addErrorToClass(errorClass, nicknameErrorTypes);
            if (this.state.valid?.nicknameIsValid) {
                this.state.valid.nicknameIsValid = false;
            }
            return;
        }

        if (this.state.valid?.nicknameIsValid === false) {
            this.state.valid.nicknameIsValid = true;
        }
    }

    /**
     * Проверяет пользовательский ввод пароля
     */
    validatePassword(e?: Event) {
        e?.preventDefault();
        const newPassword = document.querySelector(
            '.new-password'
        ) as HTMLInputElement;
        newPassword?.classList.remove('login-reg__input_error');

        addErrorToClass('', passwordErrorTypes);
        const { isError, errorClass } = checkPassword(newPassword?.value ?? '');

        if (isError) {
            newPassword?.classList?.add('login-reg__input_error');
            addErrorToClass(errorClass, passwordErrorTypes);
            if (this.state.valid?.passwordIsValid) {
                this.state.valid.passwordIsValid = false;
            }
            return;
        }

        if (this.state.valid?.passwordIsValid === false) {
            this.state.valid.passwordIsValid = true;
        }
    }

    /**
     * Проверяет пользовательский ввод подтверждения пароля
     */
    validateConfirmPassword(e?: Event) {
        e?.preventDefault();
        const repeatPassword = document.querySelector(
            '.repeat-password'
        ) as HTMLInputElement;
        repeatPassword?.classList.remove('login-reg__input_error');

        addErrorToClass('', confirmPasswordErrorTypes);
        const { isError, errorClass } = checkConfirmPassword(
            (document.querySelector('.new-password') as HTMLInputElement).value,
            repeatPassword?.value ?? ''
        );

        if (isError) {
            repeatPassword?.classList?.add('login-reg__input_error');
            addErrorToClass(errorClass, confirmPasswordErrorTypes);
            if (this.state.valid?.confirmPasswordIsValid) {
                this.state.valid.confirmPasswordIsValid = false;
            }
            return;
        }

        if (this.state.valid?.confirmPasswordIsValid === false) {
            this.state.valid.confirmPasswordIsValid = true;
        }
    }

    validateOldPassword() {
        addErrorToClass('', oldPasswordErrorTypes);
        const oldPassword = document.querySelector(
            '.old-password'
        ) as HTMLInputElement;
        oldPassword?.classList.remove('login-reg__input_error');

        if (oldPassword.value === '') {
            oldPassword?.classList.add('login-reg__input_error');
            addErrorToClass('incorrect-old-password', oldPasswordErrorTypes);
            if (this.state.valid?.oldPasswordIsValid) {
                this.state.valid.oldPasswordIsValid = false;
            }
            return;
        }

        if (this.state.valid?.oldPasswordIsValid === false) {
            this.state.valid.oldPasswordIsValid = true;
        }
    }
}
