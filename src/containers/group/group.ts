import { createEditChatAction } from '@actions/chatActions';
import { createGetContactsAction } from '@actions/contactsActions';
import { DumbAddContactInGroup } from '@components/group/group';
import { DYNAMIC } from '@config/config';
import { ChatTypes } from '@config/enum';
import { store } from '@store/store';
import { Component } from '@framework/component';

interface Props {
    chatId?: number;
    user?: User;
    chats?: Chat[];
    contacts?: User[];
    openedChat?: OpenedChat;
}

interface State {
    isMounted: boolean;
    domElements: {
        saveChangesBtn: HTMLElement | null;
    };
}

export class SmartAddUserInGroup extends Component<Props, State> {
    /**
     * Сохраняет props
     * @param {Object} props - параметры компонента
     */

    private chatId: number | undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            isMounted: false,
            domElements: {
                saveChangesBtn: null,
            },
        };

        this.chatId = this.props?.chatId;
        this.node = DYNAMIC();

        this.componentDidMount();
    }

    #contactClicked = 'rgb(37, 37, 48)';
    #contactUnClicked = 'rgb(28, 28, 36)';

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartGroup is not mounted');
        }
    }

    render() {
        if (this.state.isMounted) {
            this.props?.chats?.forEach((chat) => {
                if (chat.id == this.chatId) {
                    const addUser = new DumbAddContactInGroup({
                        groupName: chat.title,
                        contactList: this.props?.contacts,
                    });

                    if (this.node) {
                        this.node.innerHTML = addUser.render();
                    }

                    if (this.state.domElements) {
                        this.state.domElements.saveChangesBtn =
                            document.querySelector('.button-submit');
                    }
                    const input = document.querySelector(
                        '.groupName'
                    ) as HTMLInputElement;
                    input.value = chat.title;

                    this.state.domElements.saveChangesBtn?.addEventListener(
                        'click',
                        (e) => {
                            e.preventDefault();

                            this.handleClickSaveButton(input);
                        }
                    );

                    const matchesId: number[] | string[] =
                        this.#findContactsByMessageId();
                    document.querySelectorAll('.contact').forEach((ct) => {
                        const contact = ct as HTMLElement;

                        contact.style.backgroundColor = this.#contactUnClicked;
                        for (const id of matchesId) {
                            if (id == contact.getAttribute('name')) {
                                this.handleClickChooseContact(contact);
                            }
                        }

                        contact.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.handleClickChooseContact(contact);
                        });
                    });
                }
            });
        }
    }

    #findContactsByMessageId(): number[] | string[] {
        // TODO: ужас, но надежно
        const matchesId: number[] = [];
        this.props?.openedChat?.members.forEach((member) => {
            this.props?.contacts?.forEach((contact) => {
                if (member.id == contact.id) {
                    matchesId.push(member.id);
                }
            });
        });
        return matchesId;
    }

    handleClickSaveButton(input: HTMLInputElement) {
        const groupTitle = document.querySelector('.change-group__name');
        let updateChatId = 0;
        if (input.value && groupTitle) {
            groupTitle.textContent = input.value;
            const choseContacts = [
                ...this.getChoseContacts(),
                this.props?.user?.id,
            ];

            this.props?.chats?.forEach((chat) => {
                if (chat.id == this.props?.openedChat?.id) {
                    updateChatId = chat.id;
                }
            });

            const updateGroupState = {
                id: updateChatId,
                type: ChatTypes.Group,
                title: input?.value,
                members: choseContacts,
            };

            store.dispatch(createEditChatAction(updateGroupState));
        }
        input.value = '';
    }

    /**
     * Выбор контакта из списка контактов
     */
    handleClickChooseContact(contact: HTMLElement) {
        if (contact.style.backgroundColor == this.#contactUnClicked) {
            contact.style.backgroundColor = this.#contactClicked;
        } else {
            contact.style.backgroundColor = this.#contactUnClicked;
        }
    }

    componentDidMount() {
        if (!this.state.isMounted) {
            if (this.state.isMounted === false) {
                this.state.isMounted = true;
            }

            this.unsubscribe = store.subscribe(
                this.constructor.name,
                (props: Props) => {
                    this.props = props;

                    this.render();
                }
            );
        }

        store.dispatch(createGetContactsAction());
    }

    componentWillUnmount() {
        if (this.state.isMounted) {
            this.unsubscribe();
            this.state.isMounted = false;
        }
    }

    getChoseContacts() {
        const contacts: number[] = [];
        document.querySelectorAll('.contact').forEach((ct) => {
            const contact = ct as HTMLElement;

            if (contact.style.backgroundColor == this.#contactClicked) {
                const contactID = contact.getAttribute('name');
                contacts.push(Number(contactID));
            }
        });

        return contacts;
    }
}
