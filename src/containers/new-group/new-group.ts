import { DYNAMIC } from '@config/config';
import { store } from '@store/store';
import { Component } from '@framework/component';
import { createMoveToChatsAction } from '@actions/routeActions';
import {
    addErrorToClass,
    checkNewChatDescription,
    checkNewChatName,
} from '@utils/validator';
import { chatDescriptionErrorTypes, chatNameErrorTypes } from '@config/errors';
import { ChatTypes } from '@config/enum';
import { createCreateChannelAction } from '@actions/chatActions';
import { Button } from '@/uikit/button/button';
import { List } from '@/uikit/list/list';
import { createGetContactsAction } from '@/actions/contactsActions';
import { router } from '@/router/createRouter';
import { DumbGroup } from '@/components/new-group/new-group';

interface Props {
    parent: HTMLElement;
    user?: User;
    contacts?: User[];
}

interface State {
    isMounted: boolean;
    node?: DumbGroup;
    confirmBtn?: Button | null;
    cancelBtn?: Button | null;
    membersInput?: HTMLInputElement;
    btnList?: List | null;
    contacts?: User[];
    nameIsValid?: boolean;
    descriptionIsValid?: boolean;
}

export class SmartCreateGroup extends Component<Props, State> {
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

        this.state.node = new DumbGroup({
            parent: this.node,
            user: this.props.user,
            contacts: this.state.contacts,
            type: store.getState().openedChat?.type,
            chatActionType: 'Создание',
            avatar: this.props.user.avatar,
            hookContacts: this.hookContacts,
            hookUser: this.hookUser,
            backOnClick: this.backOnClick.bind(this),
            avatarOnClick: this.avatarOnClick.bind(this),
            cancelOnClick: this.cancelOnClick.bind(this),
            saveOnClick: this.saveOnClick.bind(this),
            channelNameValidate: this.validateChannelName.bind(this),
            channelDescriptionValidate:
                this.validateChannelDescription.bind(this),
            membersOnChange: this.membersOnChange.bind(this),
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
                        '.group__avatar'
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

    getCheckedLabels() {
        const contactList = Array.from(
            document.querySelectorAll(
                '.input-dropdown__list__item__checkbox input[type="checkbox"]'
            )
        ) as HTMLInputElement[];

        const checkedLabels = [];
        for (const contact of contactList) {
            if (contact.checked) {
                checkedLabels.push(contact.parentElement);
            }
        }
        return checkedLabels;
    }

    saveOnClick(e?: Event) {
        e?.preventDefault();
        this.validateChannelName();
        this.validateChannelDescription();

        const checkedLabels = this.getCheckedLabels();
        const checkedMembersId: number[] = [];

        for (const contact of checkedLabels) {
            checkedMembersId.push(
                Number(
                    (
                        contact?.querySelector(
                            '.checkbox__input'
                        ) as HTMLInputElement
                    ).id
                )
            );
        }

        if (this.isValid() && this.props.user) {
            const channel = {
                type: ChatTypes.Group,
                title: (
                    document.querySelector('.channel-name') as HTMLInputElement
                )?.value,
                avatar: '',
                description: (
                    document.querySelector(
                        '.channel-description'
                    ) as HTMLInputElement
                )?.value,
                members: [this.props.user.id, ...checkedMembersId],
            };

            store.dispatch(
                createCreateChannelAction({
                    image: this.image,
                    channel,
                })
            );

            store.dispatch(createMoveToChatsAction());
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
        const channelName = document.querySelector(
            '.channel-name'
        ) as HTMLInputElement;
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
        const channelDescription = document.querySelector(
            '.channel-description'
        ) as HTMLInputElement;
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

    membersOnChange(e?: Event) {
        e?.preventDefault();
    }

    itemOnClick(e?: Event) {
        e?.preventDefault();
    }
}
