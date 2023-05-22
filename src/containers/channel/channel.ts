import { DYNAMIC } from '@config/config';
import { store } from '@store/store';
import { Component } from '@framework/component';
import { DumbCreateChannel } from '@components/channelCreation/channel';
import {
    createMoveToChatsAction,
    createMoveToHomePageAction,
} from '@actions/routeActions';
import { addErrorToClass, checkNickname } from '@utils/validator';
import { nicknameErrorTypes } from '@config/errors';
import { ChatTypes } from '@config/enum';
import { createCreateChannelAction } from '@actions/chatActions';

interface Props {
    user?: User;
    contacts?: User[];
}

interface State {
    isMounted: boolean;
    valid: {
        channelNameIsValid: boolean;
        isValid: () => boolean;
    };
    domElements: {
        headerBackBtn: HTMLElement | null;
        headerDoneBtn: HTMLElement | null;
        channelImage: HTMLElement | null;
        channelName: HTMLInputElement | null;
        channelDescription: HTMLInputElement | null;
    };
}

export class SmartCreateChannel extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isMounted: false,
            valid: {
                channelNameIsValid: true,
                isValid: () => {
                    return this.state.valid.channelNameIsValid;
                },
            },
            domElements: {
                headerBackBtn: null,
                headerDoneBtn: null,
                channelImage: null,
                channelName: null,
                channelDescription: null,
            },
        };

        this.node = DYNAMIC();

        this.componentDidMount();
    }

    #image: File | undefined;

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartSignUp is not mounted');
        }
    }

    render() {
        if (this.state.isMounted) {
            const ChannelUI = new DumbCreateChannel({
                ...this.props.contacts,
            });

            if (this.node) {
                this.node.innerHTML = ChannelUI.render();
            }

            this.state.domElements.headerBackBtn = document.querySelector(
                '.create-channel__header__back'
            );
            this.state.domElements.headerDoneBtn = document.querySelector(
                '.create-channel__heder__done-btn'
            );
            this.state.domElements.channelImage =
                document.querySelector('.channel__avatar');

            this.state.domElements.headerBackBtn?.addEventListener(
                'click',
                () => {
                    store.dispatch(createMoveToHomePageAction());
                }
            );

            this.state.domElements.channelName = document.querySelector(
                '.custom-input__content'
            );
            this.state.domElements.channelName?.addEventListener(
                'input',
                () => {
                    this.validateChannelName(
                        this.state.domElements.channelName
                    );
                }
            );

            this.state.domElements.channelImage?.addEventListener(
                'click',
                () => {
                    this.handleClickAvatar();
                }
            );

            this.state.domElements.headerDoneBtn?.addEventListener(
                'click',
                () => {
                    this.handleClickDone();
                }
            );
        }
    }

    componentDidMount() {
        if (!this.state.isMounted) {
            this.unsubscribe = store.subscribe(
                this.constructor.name,
                (props: Props) => {
                    this.props = props;

                    this.render();
                }
            );

            this.state.isMounted = true;
        }
    }

    componentWillUnmount() {
        if (this.state.isMounted) {
            this.unsubscribe();
            this.state.isMounted = false;
        }
    }

    /**
     * Проверяет пользовательский ввод
     */
    validateChannelName(validateInput: HTMLInputElement | null) {
        validateInput?.classList.remove('data-input--error');
        addErrorToClass('', nicknameErrorTypes);

        const { isError, errorClass } = checkNickname(
            validateInput?.value ?? ''
        );

        if (isError) {
            validateInput?.classList.add('data-input--error');
            addErrorToClass(errorClass, nicknameErrorTypes);
            this.state.valid.channelNameIsValid = false;

            return;
        }

        this.state.valid.channelNameIsValid = true;
    }

    /**
     * Обрабатывает нажатие кнопки аватарки
     */
    handleClickAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.jpg';

        input.addEventListener('change', () => {
            this.#image = input?.files?.[0];
            if (this.#image) {
                const reader = new FileReader();
                reader.readAsDataURL(this.#image);
                reader.onload = () => {
                    const imageUrl = reader.result;
                    const avatar = document.querySelector(
                        '.create-channel__form__image'
                    ) as HTMLImageElement;
                    avatar.src = imageUrl as string;
                };
            }
        });

        input.click();
    }

    handleClickDone() {
        if (this.state.valid.isValid() && this.props.user) {
            const newChannel = {
                type: ChatTypes.Channel,
                title: this.state.domElements.channelName?.value,
                members: [this.props.user.id],
                // TODO: когда на бэке сделают ручки
                // avatar: this.state.domElements.channelImage,
                // description: this.state.domElements.channelDescription?.value,
                // master_id: this.props.user.id,
            } as Record<string, unknown>;

            store.dispatch(createCreateChannelAction(newChannel));
            store.dispatch(createMoveToChatsAction());
            // TODO: store.dispatch(createChannelAvatarAction(this.#image));
        }
    }
}
