import { Component } from '@framework/component';
import { DumbSignUp } from '@/components/signUp/signUp';
import {
    checkEmail,
    checkPassword,
    checkConfirmPassword,
    checkNickname,
    addErrorToClass,
} from '@utils/validator';
import { store } from '@store/store';
import {
    emailErrorTypes,
    passwordErrorTypes,
    confirmPasswordErrorTypes,
    nicknameErrorTypes,
} from '@config/errors';
import { createSignUpAction } from '@actions/authActions';
import {
    createMoveToLoginAction,
    createRenderAction,
} from '@actions/routeActions';
import { DYNAMIC, ROOT, SIDEBAR, SIGNUP, STATIC } from '@config/config';
import { createOccupiedEmailAction } from '@/actions/userActions';

interface Props {
    occupiedEmail?: boolean;
}

interface State {
    isMounted: boolean;
    valid: {
        emailIsValid: boolean;
        passwordIsValid: boolean;
        confirmPasswordIsValid: boolean;
        nicknameIsValid: boolean;
        isValid: () => boolean | undefined;
    };
    domElements: {
        email: HTMLInputElement | null;
        password: HTMLInputElement | null;
        confirmPassword: HTMLInputElement | null;
        nickname: HTMLInputElement | null;
        signUpButton: HTMLButtonElement | null;
        moveToLogin: HTMLElement | null;
    };
}

/**
 * Отрисовывает логин.
 * Прокидывает actions в стору для логина
 * Также подписывается на изменения статуса логина,
 * для корректного рендера ошибки
 */
export class SmartSignUp extends Component<Props, State> {
    /**
     * Cохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            isMounted: false,
            valid: {
                emailIsValid: false,
                passwordIsValid: false,
                confirmPasswordIsValid: false,
                nicknameIsValid: false,
                isValid: () => {
                    return (
                        this.state.valid.emailIsValid &&
                        this.state.valid.passwordIsValid &&
                        this.state.valid.confirmPasswordIsValid &&
                        this.state.valid.nicknameIsValid
                    );
                },
            },
            domElements: {
                email: null,
                password: null,
                confirmPassword: null,
                nickname: null,
                signUpButton: null,
                moveToLogin: null,
            },
        };

        this.node = ROOT();

        this.componentDidMount();
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartSignUp is not mounted');
        }
    }

    /**
     * Рендерит логин
     */
    render() {
        if (this.state.isMounted && !SIGNUP()) {
            STATIC().innerHTML = DYNAMIC().innerHTML = SIDEBAR().innerHTML = '';
            new DumbSignUp({
                parent: ROOT(),
            });

            this.state.domElements.signUpButton =
                document.querySelector('.reg__form__btn');
            this.state.domElements.signUpButton?.addEventListener(
                'click',
                (e) => {
                    e.preventDefault();

                    this.handleClickSignUp();
                }
            );

            this.state.domElements.moveToLogin =
                document.querySelector('.reg-ques');
            this.state.domElements.moveToLogin?.addEventListener(
                'click',
                (e) => {
                    e.preventDefault();

                    this.handleClickMoveToLogin();
                }
            );

            this.state.domElements.email = document.querySelector('.email');
            this.state.domElements.email?.addEventListener('input', (e) => {
                e.preventDefault();

                this.validateEmail();
            });

            this.state.domElements.password =
                document.querySelector('.password');
            this.state.domElements.password?.addEventListener('input', (e) => {
                e.preventDefault();

                this.validatePassword();
            });

            this.state.domElements.confirmPassword =
                document.querySelector('.confirm-password');
            this.state.domElements.confirmPassword?.addEventListener(
                'input',
                (e) => {
                    e.preventDefault();

                    this.validateConfirmPassword();
                }
            );

            this.state.domElements.nickname =
                document.querySelector('.nickname');
            this.state.domElements.nickname?.addEventListener('input', (e) => {
                e.preventDefault();

                this.validateNickname();
            });
        }
    }

    /**
     * Показывает, что была введа занятая почта
     */
    occupiedEmail() {
        if (this.state.isMounted && this.props?.occupiedEmail) {
            this.state.domElements.email?.classList.add(
                'login-reg__input_error'
            );
            addErrorToClass('occupied-email', emailErrorTypes);
            store.dispatch(createOccupiedEmailAction(false));
        }
    }

    /**
     * Навешивает переданные обработчики на валидацию и кнопки
     */
    componentDidMount() {
        if (!this.state.isMounted) {
            this.unsubscribe = store.subscribe(
                this.constructor.name,
                (props: Props) => {
                    this.props = props;

                    this.render();
                    this.occupiedEmail();
                }
            );

            if (this.state.isMounted === false) {
                this.state.isMounted = true;
            }

            store.dispatch(createRenderAction());
        }
    }

    /**
     * Удаляет все подписки
     */
    componentWillUnmount() {
        if (this.state.isMounted) {
            this.unsubscribe();
            this.state.isMounted = false;

            SIGNUP().remove();
        }
    }

    /**
     * Обрабатывает нажатие кнопки логина
     */
    handleClickSignUp() {
        if (this.state.valid.isValid()) {
            const user = {
                nickname: this.state.domElements.nickname?.value,
                email: this.state.domElements.email?.value,
                password: this.state.domElements.password?.value,
            } as Record<string, unknown>;

            store.dispatch(createSignUpAction(user));
        }
    }

    /**
     * Обрабатывает нажатие кнопки перехода на страничку регистрации
     */
    handleClickMoveToLogin() {
        store.dispatch(createMoveToLoginAction());
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

    /**
     * Проверяет пользовательский ввод пароля
     */
    validatePassword() {
        this.state.domElements.password?.classList.remove(
            'login-reg__input_error'
        );
        addErrorToClass('', passwordErrorTypes);

        const { isError, errorClass } = checkPassword(
            this.state.domElements.password?.value ?? ''
        );

        if (isError) {
            this.state.domElements.password?.classList.add(
                'login-reg__input_error'
            );
            addErrorToClass(errorClass, passwordErrorTypes);
            if (this.state.valid.passwordIsValid) {
                this.state.valid.passwordIsValid = false;
            }
            return;
        }

        if (this.state.valid.passwordIsValid === false) {
            this.state.valid.passwordIsValid = true;
        }
    }

    /**
     * Проверяет пользовательский ввод подтверждения пароля
     */
    validateConfirmPassword() {
        this.state.domElements.confirmPassword?.classList.remove(
            'login-reg__input_error'
        );

        addErrorToClass('', confirmPasswordErrorTypes);

        const { isError, errorClass } = checkConfirmPassword(
            this.state.domElements.password?.value ?? '',
            this.state.domElements.confirmPassword?.value ?? ''
        );

        if (isError) {
            this.state.domElements.confirmPassword?.classList.add(
                'login-reg__input_error'
            );
            addErrorToClass(errorClass, confirmPasswordErrorTypes);
            if (this.state.valid.confirmPasswordIsValid) {
                this.state.valid.confirmPasswordIsValid = false;
            }
            return;
        }

        // если было false и была ошщибка, то теперь ошибки нет
        if (this.state.valid.confirmPasswordIsValid === false) {
            this.state.valid.confirmPasswordIsValid = true;
        }
    }

    /**
     * Проверяет пользовательский ввод имени
     */
    validateNickname() {
        this.state.domElements.nickname?.classList.remove(
            'login-reg__input_error'
        );
        addErrorToClass('', nicknameErrorTypes);

        const { isError, errorClass } = checkNickname(
            this.state.domElements.nickname?.value ?? ''
        );

        if (isError) {
            this.state.domElements.nickname?.classList.add(
                'login-reg__input_error'
            );
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
}
