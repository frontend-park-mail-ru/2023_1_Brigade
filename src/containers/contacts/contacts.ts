import { Component } from '@framework/component';
import { store } from '@store/store';
import { createGetContactsAction } from '@actions/contactsActions';
import { DumbContacts } from '@components/contacts/contacts';
import {
    createCreateDialogAction,
    createDeleteSearchedChatsAction,
    createSearchChatsAction,
} from '@actions/chatActions';
import { STATIC } from '@config/config';
import { List } from '@/uikit/list/list';
import { ContactItem } from '@/components/contact-item/contact-item';

interface Props {
    user?: User;
    contacts?: User[];
    founded_contacts?: User[];
}

interface State {
    isMounted: boolean;
    domElements: {
        list: List | null;
        items: ContactItem[];
        input: HTMLInputElement | null;
        inputValue: string;
        contacts: HTMLElement | null;
        headContacts: HTMLElement | null;
        addContactButton: HTMLElement | null;
    };
}

export class SmartContacts extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isMounted: false,
            domElements: {
                list: null,
                items: [],
                input: null,
                inputValue: '',
                headContacts: null,
                contacts: null,
                addContactButton: null,
            },
        };

        this.node = STATIC();
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartContacts is not mounted');
        }
    }

    render() {
        if (this.state.isMounted && this.props?.user) {
            if (!this.props.contacts) {
                this.props.contacts = [];
            }

            this.state.domElements.inputValue =
                this.state.domElements.input?.value ?? '';

            this.state.domElements.items?.forEach((item) => {
                item.componentWillUnmount();
            });
            if (this.state.domElements.items) {
                this.state.domElements.items = [];
            }

            this.state.domElements.list?.componentWillUnmount();

            const ContactsUI = new DumbContacts({
                contacts: [],
            });

            if (this.node) {
                this.node.innerHTML = ContactsUI.render();
            }

            this.state.domElements.input = document.querySelector(
                '.contacts__header__input'
            );
            if (this.state.domElements.input) {
                this.state.domElements.input.value =
                    this.state.domElements.inputValue;
            }

            this.state.domElements.input?.addEventListener('keyup', (e) => {
                this.handleSearch(e);
            });

            this.state.domElements.contacts = document.querySelector(
                '.contacts__contacts'
            );
            if (this.state.domElements.contacts) {
                this.state.domElements.contacts.innerHTML = '';

                this.state.domElements.list = new List({
                    parent: this.state.domElements.contacts,
                });

                this.state.domElements.list?.componentDidMount();

                if (this.props.founded_contacts) {
                    this.props.founded_contacts.forEach((contact) => {
                        const contactItem = new ContactItem({
                            contact,
                            onClick: () => {
                                store.dispatch(
                                    createCreateDialogAction(contact)
                                );

                                if (this.state.domElements.input) {
                                    this.state.domElements.input.value = '';
                                }
                                store.dispatch(
                                    createDeleteSearchedChatsAction()
                                );
                            },
                            parent: this.state.domElements.list?.getNode(),
                            observe: ['founded_contacts'],
                        });

                        contactItem.componentDidMount();

                        this.state.domElements.items.push(contactItem);
                    });
                } else {
                    this.props.contacts.forEach((contact) => {
                        const contactItem = new ContactItem({
                            contact,
                            onClick: () => {
                                store.dispatch(
                                    createCreateDialogAction(contact)
                                );

                                if (this.state.domElements.input) {
                                    this.state.domElements.input.value = '';
                                }
                                store.dispatch(
                                    createDeleteSearchedChatsAction()
                                );
                            },
                            parent: this.state.domElements.list?.getNode(),
                            observe: ['contacts'],
                        });

                        contactItem.componentDidMount();

                        this.state.domElements.items.push(contactItem);
                    });
                }
            }
        }
    }

    handleSearch(e: KeyboardEvent) {
        e.stopPropagation();

        if (this.state.domElements.input?.value.trim()) {
            store.dispatch(
                createSearchChatsAction(
                    this.state.domElements.input?.value.trim()
                )
            );
        } else {
            store.dispatch(createDeleteSearchedChatsAction());
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

            if (this.state.isMounted === false) {
                this.state.isMounted = true;
            }

            store.dispatch(createGetContactsAction());
        }
    }

    componentWillUnmount() {
        if (this.state.isMounted) {
            this.unsubscribe();
            this.state.isMounted = false;
        }
    }

    /**
     * Обработчик клика на контакте
     * @param {HTMLElement} contact - контакт, на который был клик
     * @returns {void}
     */
    handleClickCreateDialog(contact: HTMLElement) {
        if (contact.classList.contains('contact')) {
            const contactStringId = contact.getAttribute('name');
            if (contactStringId) {
                const contactId = parseInt(contactStringId);
                this.props?.contacts?.forEach((contact) => {
                    if (contact.id === contactId) {
                        store.dispatch(createCreateDialogAction(contact));
                    }
                });
            }
        }
    }
}
