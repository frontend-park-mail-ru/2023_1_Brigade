import { Component } from '@framework/component';
import { DumbProfile } from '@components/new-profile/profile';
import { DYNAMIC } from '@config/config';
import { router } from '@router/createRouter';
import { Popup } from '@components/popup/popup';
import { store } from '@/store/store';
import { createLogoutAction } from '@/actions/authActions';
import { createIncorrectPasswordAction, createUpdateUserAction } from '@/actions/userActions';
import { Input } from '@uikit/input/input';
import { confirmPasswordErrorTypes, emailErrorTypes, newPasswordErrorTypes, nicknameErrorTypes, passwordErrorTypes, usernameErrorTypes } from '@/config/errors';
import { addErrorToClass, checkEmail, checkNewPassword, checkNickname, checkPassword } from '@/utils/validator';
import { List } from '@/uikit/list/list';
import { Button } from '@/uikit/button/button';

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
    btnList?: List;
    confirmBtn?: Button;
    cancelBtn?: Button;
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

        // if (this.state.valid.isValid()) {
            const user = {
                email: (document.querySelector('.email') as HTMLInputElement).value,
                new_avatar_url: store.getState()?.user?.avatar ?? '',
                nickname: (document.querySelector('.nickname') as HTMLInputElement)
                    .value,
                status: (document.querySelector('.status') as HTMLInputElement)
                    .value,
                current_password: '',
                new_password: '',
            };

            if (this.popup) {
                user.current_password = (document.querySelector('.old-password') as HTMLInputElement)?.value;
                user.new_password = (document.querySelector('.new-password') as HTMLInputElement)?.value;
            }
    
            const forUpdate = {
                image: this.image,
                user,
            };
    
            store.dispatch(createUpdateUserAction(forUpdate));
    
            this.popup?.destroy();
            this.popup = null;
        // }
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

        const root = document.getElementById('root');
        if (!this.popup) {
            this.popup = new Popup({
                parent: root as HTMLElement,
                title: 'Смена пароля',
                className: 'profile-popup',
            });

            const popContent: HTMLElement | null = document.querySelector('.popup__content') as HTMLElement;

            if (popContent) {
                this.state.oldPassword = new Input({
                    label: 'Старый пароль',
                    parent: popContent as HTMLElement,
                    className: 'input-container profile__form__input',
                    placeholder: 'введите старый пароль',
                    errors: passwordErrorTypes,
                    uniqClassName: 'old-password',
                    type: 'password',
                });
        
                this.state.newPassword = new Input({
                    label: 'Новый пароль',
                    parent: popContent as HTMLElement,
                    className: 'input-container profile__form__input',
                    placeholder: 'введите новый пароль',
                    errors: passwordErrorTypes,
                    uniqClassName: 'new-password',
                    type: 'password',
                });
        
                this.state.repeatPassword = new Input({
                    label: 'Повторите пароль',
                    parent: popContent as HTMLElement,
                    className: 'input-container profile__form__input',
                    placeholder: 'повторите пароль',
                    errors: confirmPasswordErrorTypes,
                    uniqClassName: 'repeat-password',
                    type: 'password',
                });
    
                this.state.btnList = new List({
                    parent: popContent as HTMLElement,
                    className: 'popup__btn-list',
                });
                this.state.btnList.getNode()?.classList.remove('list');
    
                this.state.confirmBtn = new Button({
                    parent: document.querySelector('.popup__btn-list') as HTMLElement,
                    className: 'popup__btn confirm__btn button-S',
                    label: 'Подтвердить',
                    onClick: () => {
                        // if (this.state.valid.isValid()) {
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
                        // }
                    },
                });
        
                this.state.cancelBtn = new Button({
                    parent: document.querySelector('.popup__btn-list') as HTMLElement,
                    className: 'popup__btn cancel__btn button-S',
                    label: 'Отмена',
                    onClick: () => {
                        this.popup?.destroy();
                        this.popup = null;
                    },
                });
            }
            
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
