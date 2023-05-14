import { Component } from '@framework/component';
import { DumbLogin } from '@components/login/login';
import { checkEmail, checkPassword, addErrorToClass } from '@utils/validator';
import { store } from '@store/store';
import { emailErrorTypes, passwordErrorTypes } from '@config/errors';
import { createLoginAction } from '@actions/authActions';
import {
    createMoveToSignUpAction,
    createRenderAction,
} from '@actions/routeActions';
import { DYNAMIC, LOGIN, ROOT, SIDEBAR, STATIC } from '@config/config';
import { createInvalidEmailAction } from '@/actions/userActions';

interface Props {
    invalidEmail?: boolean;
}

interface State {
    isSubscribed: boolean;
    domElements: {
        email: HTMLInputElement | null;
        password: HTMLInputElement | null;
        loginButton: HTMLButtonElement | null;
        moveToSignUp: HTMLElement | null;
    };
    valid: {
        emailIsValid: boolean;
        passwordIsValid: boolean;
        isValid: () => boolean | undefined;
    };
}

/**
 * Отрисовывает логин.
 * Прокидывает actions в стору для логина
 * Также подписывается на изменения статуса логина,
 * для корректного рендера ошибки
 *
 */
export class SmartLogin extends Component<Props, State> {
    /**
     * Cохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            isSubscribed: false,
            valid: {
                emailIsValid: false,
                passwordIsValid: false,
                isValid: () => {
                    return (
                        this.state.valid.emailIsValid &&
                        this.state.valid.passwordIsValid
                    );
                },
            },
            domElements: {
                email: null,
                password: null,
                loginButton: null,
                moveToSignUp: null,
            },
        };

        this.node = ROOT; // я бы для ноды вызывал метод render(), типо рендер текущей компоненты
    }

    /**
     * Рендерит логин
     */
    render() {
        if (this.state.isSubscribed && !LOGIN()) {
            const LoginUI = new DumbLogin({
                parent: document.getElementById('root') as HTMLElement,
            });

            SIDEBAR.innerHTML = STATIC.innerHTML = DYNAMIC.innerHTML = '';

            this?.node?.insertAdjacentHTML('afterbegin', LoginUI.render());

            this.state.domElements.loginButton =
                document.querySelector('.login-but');
            this.state.domElements.loginButton?.addEventListener(
                'click',
                (e) => {
                    e.preventDefault();

                    this.handleClickLogin();
                }
            );

            this.state.domElements.moveToSignUp =
                document.querySelector('.login-ques');
            this.state.domElements.moveToSignUp?.addEventListener(
                'click',
                (e) => {
                    e.preventDefault();

                    this.handleClickMoveToSignUp();
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
        }
    }

    /**
     * Показывает, что была введа незарегистрированная почта
     */
    invalidEmail() {
        if (this.state.isSubscribed && this.props?.invalidEmail) {
            this.state.domElements.email?.classList.add(
                'login-reg__input_error'
            );
            addErrorToClass('invalid-email', emailErrorTypes);

            this.state.domElements.password?.classList.add(
                'login-reg__input_error'
            );
            addErrorToClass('incorrect-password', passwordErrorTypes);

            store.dispatch(createInvalidEmailAction(false));
        }
    }

    /**
     * Навешивает переданные обработчики на валидацию и кнопки
     */
    componentDidMount() {
        if (this.state.isSubscribed === false) {
            this.unsubscribe = store.subscribe(
                this.constructor.name,
                (props: Props) => {
                    this.props = props;

                    this.render();
                    this.invalidEmail();
                }
            );

            this.state.isSubscribed = true;

            store.dispatch(createRenderAction());
        }
    }

    /**
     * Удаляет все подписки
     */
    componentWillUnmount() {
        if (this.state.isSubscribed) {
            this.unsubscribe();
            this.state.isSubscribed = false;

            LOGIN().remove();
        }
    }

    /**
     * Обрабатывает нажатие кнопки логина
     */
    handleClickLogin() {
        if (this.state.valid.isValid()) {
            const user = {
                email: this.state.domElements.email?.value,
                password: this.state.domElements.password?.value,
            } as Record<string, unknown>;

            store.dispatch(createLoginAction(user));
        }
    }

    /**
     * Обрабатывает нажатие кнопки перехода на страничку регистрации
     */
    handleClickMoveToSignUp() {
        store.dispatch(createMoveToSignUpAction());
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
                this.state.valid.emailIsValid = false;
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
}
