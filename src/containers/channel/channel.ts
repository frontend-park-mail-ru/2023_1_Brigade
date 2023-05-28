import { DYNAMIC } from '@config/config';
import { store } from '@store/store';
import { Component } from '@framework/component';
import {
    createMoveToChatsAction,
    createMoveToHomePageAction,
} from '@actions/routeActions';
import { addErrorToClass, checkNewChatDescription, checkNewChatName } from '@utils/validator';
import { chatDescriptionErrorTypes, chatNameErrorTypes } from '@config/errors';
import { ChatTypes } from '@config/enum';
import { createCreateChannelAction } from '@actions/chatActions';
import { DumbChannel } from '@/components/new-channel/new-channel';
import { Button } from '@/uikit/button/button';
import { List } from '@/uikit/list/list';
import { createGetContactsAction } from '@/actions/contactsActions';
import { router } from '@/router/createRouter';

interface Props {
    parent: HTMLElement;
    user?: User;
}

interface State {
    isMounted: boolean;
    node?: DumbChannel;
    confirmBtn?: Button | null;
    cancelBtn?: Button | null;
    btnList?: List | null;
    contacts?: User[];
    nameIsValid?: boolean;
    descriptionIsValid?: boolean;
}

export class SmartCreateChannel extends Component<Props, State> {
    constructor(props: Props) {
        DYNAMIC().innerHTML = '';
        super(props);
        this.state = {
            isMounted: false,
            btnList: null,
            cancelBtn: null,
            confirmBtn: null,
            nameIsValid: false,
            descriptionIsValid: false,
        };
        this.state.contacts = this.getContacts();

        this.node = this.render() as HTMLElement;
        this.componentDidMount();
    }

    private image: File | undefined;
    private getContacts(): User[] | undefined {
        store.dispatch(createGetContactsAction());
        return store.getState().contacts;
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartChannel is not mounted');
        }
    }

    render() {
        return this.props.parent;
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        if (!this.state.isMounted) {
            this.state.isMounted = true;
        }

        if (!this.props.user) {
            return;
        }

        this.state.node = new DumbChannel({
            parent: this.node,
            user: this.props.user,
            contacts: this.state.contacts,
            hookContacts: this.hookContacts,
            hookUser: this.hookUser,
            backOnClick: this.backOnClick.bind(this),
            avatarOnClick: this.avatarOnClick.bind(this),
            cancelOnClick: this.cancelOnClick.bind(this),
            saveOnClick: this.saveOnClick.bind(this),
            channelNameValidate: this.validateChannelName.bind(this),
            channelDescriptionValidate:
                this.validateChannelDescription.bind(this),
        });
    }

    componentWillUnmount() {
        if (!this.node && !this.state.isMounted) {
            return;
        }

        if (this.state.node) {
            this.state.node.destroy();
        }

        this.unsubscribe();
        this.state.isMounted = false;
    }

    hookContacts(state: StoreState): User[] | undefined {
        return state.contacts ?? undefined;
    }

    hookUser(state: StoreState): User | undefined {
        return state.user ?? undefined;
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
            if (this.image) {
                const reader = new FileReader();
                reader.readAsDataURL(this.image);
                reader.onload = () => {
                    const imageUrl = reader.result;
                    const avatar = document.querySelector(
                        '.channel__avatar'
                    ) as HTMLImageElement;
                    avatar.src = imageUrl as string;
                };
            }
        });

        input.click();
    }

    backOnClick() {
        router.route('/');
    }

    cancelOnClick(e?: Event) {
        e?.preventDefault();
        router.route('/');
    }

    saveOnClick(e?: Event) {
        e?.preventDefault();
        if (this.isValid() && this.props.user) {
            const newChannel = {
                type: ChatTypes.Channel,
                title: (
                    document.querySelector('.channel-name') as HTMLInputElement
                )?.value,
                description: (
                    document.querySelector('.channel-description') as HTMLInputElement
                )?.value,
                members: [this.props.user.id],
            } as Record<string, unknown>;

            store.dispatch(createCreateChannelAction(newChannel));
            store.dispatch(createMoveToChatsAction());
            // TODO: store.dispatch(createChannelAvatarAction(this.#image));
        }
    }

    isValid(): boolean | undefined {
        return this.state.nameIsValid && this.state.descriptionIsValid;
    }

    /**
    //  * Проверяет пользовательский ввод
    //  */
    validateChannelName(e?: Event) {
        e?.preventDefault();
        const channelName = document.querySelector('.channel-name') as HTMLInputElement;
        channelName?.classList.remove('login-reg__input_error');
        addErrorToClass('', chatNameErrorTypes);

        const { isError, errorClass } = checkNewChatName(
            channelName.value ?? ''
        );

        if (isError) {
            channelName?.classList.add('login-reg__input_error');
            addErrorToClass(errorClass, chatNameErrorTypes);
            if (this.state.nameIsValid) {
                this.state.nameIsValid = false;
            }

            return;
        }

        if (this.state.nameIsValid === false) {
            this.state.nameIsValid = true;
        }
    }

    validateChannelDescription(e?: Event) {
        e?.preventDefault();
        const channelDescription = document.querySelector('.channel-description') as HTMLInputElement;
        channelDescription?.classList.remove('login-reg__input_error');
        addErrorToClass('', chatDescriptionErrorTypes);

        const { isError, errorClass } = checkNewChatDescription(
            channelDescription.value ?? ''
        );

        if (isError) {
            channelDescription?.classList.add('login-reg__input_error');
            addErrorToClass(errorClass, chatDescriptionErrorTypes);
            if (this.state.descriptionIsValid) {
                this.state.descriptionIsValid = false;
            }

            return;
        }

        if (this.state.descriptionIsValid === false) {
            this.state.descriptionIsValid = true;
        }
    }
}
