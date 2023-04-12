import { Container } from "@containers/container";
import { DumbProfile } from "@/components/profile/profile";
import { checkPassword, checkNickname, addErrorToClass } from "@/utils/validator";
import { store } from "@/store/store";
import { passwordErrorTypes, usernameErrorTypes, nicknameErrorTypes } from "@/config/errors";
import { createUpdateUserAction, createUpdateUserAvatarAction } from "@/actions/userActions";
import { createRenderAction } from "@/actions/routeActions";

export interface SmartProfile {
    state: {
        isSubscribed: boolean,
        valid: {
            currentPasswordIsValid: boolean,
            newPasswordIsValid: boolean,
            nicknameIsValid: boolean,
            isValid: () => boolean,
        },
        domElements: {
            avatar: HTMLInputElement | null,
            username: HTMLInputElement | null,
            nickname: HTMLInputElement | null,
            status: HTMLInputElement | null,
            current_password: HTMLInputElement | null,
            new_password: HTMLInputElement | null,
            saveButton: HTMLInputElement | null,
        }
    }
}

/**
* Отрисовывает страницу пользователя.
* Прокидывает actions в стору для изменения данных о пользователе
*/
export class SmartProfile extends Container {
    /**
     * Cохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props :componentProps) {
        super(props);
        this.state = {
            isSubscribed: false,
            valid: {
                currentPasswordIsValid: false,
                newPasswordIsValid: false,
                nicknameIsValid: false,
                isValid: () => {
                    return this.state.valid.currentPasswordIsValid &&
                           this.state.valid.newPasswordIsValid &&
                           this.state.valid.nicknameIsValid;
                }
            },
            domElements: {
                avatar: null,
                username: null,
                nickname: null,
                status: null,
                current_password: null,
                new_password: null,
                saveButton: null,
            }
        };
    }

    #image:    File | undefined;

    /**
     * Рендерит логин
     */
    render() {
        if (this.state.isSubscribed && this.props.user) {
            const ProfileUI = new DumbProfile({
                ...this.props,
            });

            this.rootNode.innerHTML = ProfileUI.render();

            this.state.domElements.avatar = document.querySelector('.ellipse-icon');
            this.state.domElements.avatar?.addEventListener('click', () => {
                this.handleClickAvatar()
            });

            this.state.domElements.saveButton = document.querySelector('.button-save');
            this.state.domElements.saveButton?.addEventListener('click', (e) => {
                e.preventDefault();

                this.handleClickSave();
            });

            this.state.domElements.current_password = document.querySelector('.current-password');
            this.state.domElements.current_password?.addEventListener('input', (e) => {
                e.preventDefault();

                this.validateCurrentPassword();
            });

            this.state.domElements.new_password = document.querySelector('.new-password');
            this.state.domElements.new_password?.addEventListener('input', (e) => {
                e.preventDefault();

                this.validateNewPassword();
            });

            this.state.domElements.nickname = document.querySelector('.nickname');
            this.state.domElements.nickname?.addEventListener('input', (e) => {
                e.preventDefault();

                this.validateNickname();
            });

            this.state.domElements.username = document.querySelector('.username');
            this.state.domElements.username?.addEventListener('input', (e) => {
                e.preventDefault();

                this.validateUsername();
            });
        }
    }

    /**
     * Показывает, что был введен занятый username
     */
    occupiedUsername() {
        if (this.state.isSubscribed && this.props?.occupiedUsername) {
            this.state.domElements.username?.classList.add('data-input--error');
            addErrorToClass('occupied-username', usernameErrorTypes);
        }
    }

    /**
     * Навешивает переданные обработчики на валидацию и кнопки
     */
    componentDidMount() {
        if (!this.state.isSubscribed) {
            this.unsubscribe.push(store.subscribe(this.constructor.name, (pr: componentProps) => {
                this.props = pr;

                this.render();
                this.occupiedUsername();
            }));

            this.state.isSubscribed = true;

            store.dispatch(createRenderAction());
        }
    }

    /**
     * Удаляет все подписки
     */
    componentWillUnmount() {
        if (this.state.isSubscribed) {
            this.unsubscribe.forEach((uns) => uns());
            this.state.isSubscribed = false;
        }
    }

    /**
     * Обрабатывает нажатие кнопки аватарки
     */
    handleClickAvatar() {
        const input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', () => {
            this.#image = input?.files?.[0];
            if (this.#image) {
                const reader = new FileReader();
                reader.readAsDataURL(this.#image);
                reader.onload = () => {
                    const imageUrl = reader.result;
                    const avatar = document.querySelector('.ellipse-icon') as HTMLImageElement;
                    avatar.src = imageUrl as string;
                };
            }
        });

        input.click();
    }

    /**
     * Обрабатывает нажатие кнопки логина
     */
    handleClickSave() {
        // if (this.state.valid.isValid()) {
            const user = {
                username: this.state.domElements.username?.value,
                nickname: this.state.domElements.nickname?.value,
                status: this.state.domElements.status?.value,
                current_password: this.state.domElements.current_password?.value,
                new_password: this.state.domElements.new_password?.value,
            } as anyObject;

            // store.dispatch(createUpdateUserAction(user));
            store.dispatch(createUpdateUserAvatarAction(this.#image));
        // }
    }

    /**
     * Проверяет пользовательский ввод текущего пароля
     */
    validateCurrentPassword() {
        this.state.domElements.current_password?.classList.remove('data-input--error');
        addErrorToClass('', passwordErrorTypes);

        const { isError, errorClass } = checkPassword(this.state.domElements.current_password?.value ?? '');

        if (isError) {
            this.state.domElements.current_password?.classList.add('data-input--error');
            addErrorToClass(errorClass, passwordErrorTypes);
            this.state.valid.currentPasswordIsValid = false;
            return;
        }

        if (this.state.domElements.current_password?.value !== this.props.user.password) {
            // TODO:
            this.state.domElements.current_password?.classList.add('data-input--error');
            addErrorToClass(errorClass, passwordErrorTypes);
            this.state.valid.currentPasswordIsValid = false;
            return;
        }

        this.state.valid.currentPasswordIsValid = true;
    }

    /**
     * Проверяет пользовательский ввод нового пароля
     */
    validateNewPassword() {
        this.state.domElements.new_password?.classList.remove('data-input--error');
        addErrorToClass('', passwordErrorTypes);

        const { isError, errorClass } = checkPassword(this.state.domElements.new_password?.value ?? '');

        if (isError) {
            this.state.domElements.new_password?.classList.add('data-input--error');
            addErrorToClass(errorClass, passwordErrorTypes);
            this.state.valid.newPasswordIsValid = false;
            return;
        }

        this.state.valid.newPasswordIsValid = true;
    }

    /**
     * Проверяет пользовательский ввод имени
     */
    validateNickname() {
        this.state.domElements.nickname?.classList.remove('data-input--error');
        addErrorToClass('', nicknameErrorTypes);

        const { isError, errorClass } = checkNickname(this.state.domElements.nickname?.value ?? '');

        if (isError) {
            this.state.domElements.nickname?.classList.add('data-input--error');
            addErrorToClass(errorClass, passwordErrorTypes);
            this.state.valid.nicknameIsValid = false;
            return;
        }

        this.state.valid.nicknameIsValid = true;
    }

    validateUsername() {
        this.state.domElements.username?.classList.remove('data-input--error');
        addErrorToClass('', usernameErrorTypes);
    }
}
