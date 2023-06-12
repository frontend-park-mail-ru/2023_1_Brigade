import { Component } from '@framework/component';
import { store } from '@store/store';
import {
    createCreateDialogAction,
    createDeleteSearchedChatsAction,
    createGetChatsAction,
    createSearchChatsAction,
} from '@actions/chatActions';
import { DumbChatList } from '@components/chatList/chatList';
import {
    createMoveToChatAction,
    createMoveToCreateChannelAction,
    createMoveToCreateGroupAction,
} from '@actions/routeActions';
import { STATIC } from '@config/config';
import { List } from '@components/list/list';
import { ChatItem } from '@/components/chat-item/chat-item';
import { ContactItem } from '@/components/contact-item/contact-item';
import { TitleItem } from '@/components/title-item/title-item';
import { isMobile } from '@/utils/screen';

interface Props {
    user?: User;
    chats?: Chat[];
    openedChat?: OpenedChat;
    founded_channels?: Chat[];
    founded_chats?: Chat[];
    founded_messages?: Chat[];
    founded_contacts?: User[];
}

interface State {
    isMounted: boolean;

    domElements: {
        list: List | null;
        items: (ChatItem | ContactItem | TitleItem)[];
        input: HTMLInputElement | null;
        inputValue: string;
        chats: HTMLElement | null;
        createBtn: HTMLElement | null;
        dropdownToggle: HTMLElement | null;
        dropdownMenu: HTMLElement | null;
    };

    isSearching: boolean;
    currentChat: number;
}

export class SmartChatList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isMounted: false,

            domElements: {
                list: null,
                items: [],
                input: null,
                inputValue: '',
                chats: null,
                createBtn: null,
                dropdownToggle: null,
                dropdownMenu: null,
            },

            isSearching: false,
            currentChat: 0,
        };

        this.node = STATIC();
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartSignUp is not mounted');
        }
    }

    render() {
        if (this.state.isMounted && this.props?.user) {
            if (!this.props?.chats) {
                this.props.chats = [];
            }

            if (isMobile()) {
                this.componentWillUnmount();
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

            const ChatListUI = new DumbChatList({
                chats: [],
            });

            if (this.node) {
                this.node.innerHTML = ChatListUI.render();
            }

            this.state.domElements.input = document.querySelector(
                '.chats__header__input'
            );
            if (this.state.domElements.input) {
                this.state.domElements.input.value =
                    this.state.domElements.inputValue;
            }

            this.state.domElements.input?.addEventListener('keyup', (e) => {
                this.handleSearch(e);
            });

            this.state.domElements.chats =
                document.querySelector('.empty_chats');
            if (this.state.domElements.chats) {
                this.state.domElements.chats.innerHTML = '';

                this.state.domElements.list = new List({
                    parent: this.state.domElements.chats,
                });

                this.state.domElements.list?.componentDidMount();

                if (
                    this.props.founded_channels ||
                    this.props.founded_chats ||
                    this.props.founded_messages ||
                    this.props.founded_contacts
                ) {
                    let titleItem = new TitleItem({
                        parent: this.state.domElements.list?.getNode(),
                        title: 'Контакты и чаты',
                    });
                    titleItem.componentDidMount();
                    this.state.domElements.items.push(titleItem);

                    this.props.founded_contacts?.forEach((contact) => {
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

                    this.props.founded_chats?.forEach((chat) => {
                        let isCurrent = false;
                        if (chat.id == this.state.currentChat) {
                            isCurrent = true;
                        }
                        const chatItem = new ChatItem({
                            chat,
                            onClick: () => {
                                store.dispatch(
                                    createMoveToChatAction({
                                        chatId: chat.id,
                                    })
                                );

                                if (this.state.currentChat) {
                                    this.state.currentChat = chat.id;
                                }

                                if (this.state.domElements.input) {
                                    this.state.domElements.input.value = '';
                                }

                                store.dispatch(
                                    createDeleteSearchedChatsAction()
                                );
                            },
                            parent: this.state.domElements.list?.getNode(),
                            observe: ['founded_chats'],
                            isCurrent,
                        });

                        this.state.domElements.items.push(chatItem);
                    });

                    titleItem = new TitleItem({
                        parent: this.state.domElements.list?.getNode(),
                        title: 'Новые каналы',
                    });
                    titleItem.componentDidMount();
                    this.state.domElements.items.push(titleItem);

                    this.props.founded_channels?.forEach((chat) => {
                        let isCurrent = false;
                        if (chat.id == this.state.currentChat) {
                            isCurrent = true;
                        }
                        const chatItem = new ChatItem({
                            chat,
                            onClick: () => {
                                store.dispatch(
                                    createMoveToChatAction({
                                        chatId: chat.id,
                                    })
                                );

                                if (this.state.currentChat) {
                                    this.state.currentChat = chat.id;
                                }

                                if (this.state.domElements.input) {
                                    this.state.domElements.input.value = '';
                                }

                                store.dispatch(
                                    createDeleteSearchedChatsAction()
                                );
                            },
                            parent: this.state.domElements.list?.getNode(),
                            observe: ['founded_channels'],
                            isCurrent,
                        });

                        this.state.domElements.items.push(chatItem);
                    });

                    titleItem = new TitleItem({
                        parent: this.state.domElements.list?.getNode(),
                        title: 'Сообщения',
                    });
                    titleItem.componentDidMount();
                    this.state.domElements.items.push(titleItem);

                    this.props.founded_messages?.forEach((chat) => {
                        let isCurrent = false;
                        if (chat.id == this.state.currentChat) {
                            isCurrent = true;
                        }
                        const chatItem = new ChatItem({
                            chat,
                            onClick: () => {
                                store.dispatch(
                                    createMoveToChatAction({
                                        chatId: chat.id,
                                    })
                                );

                                if (this.state.currentChat) {
                                    this.state.currentChat = chat.id;
                                }

                                if (this.state.domElements.input) {
                                    this.state.domElements.input.value = '';
                                }

                                store.dispatch(
                                    createDeleteSearchedChatsAction()
                                );
                            },
                            parent: this.state.domElements.list?.getNode(),
                            observe: ['founded_messages'],
                            isCurrent,
                        });

                        this.state.domElements.items.push(chatItem);
                    });

                    this.state.domElements.input?.focus();
                } else {
                    this.props.chats?.forEach((chat) => {
                        if (this.state.currentChat) {
                            this.state.currentChat =
                                this.props.openedChat?.id ?? 0;
                        }

                        let isCurrent = false;
                        if (
                            chat.id ==
                            parseInt(
                                window.location.pathname.match(
                                    /^\/(\d+)$/
                                )?.[1] ?? ''
                            )
                        ) {
                            isCurrent = true;
                        }
                        const chatItem = new ChatItem({
                            chat,
                            onClick: () => {
                                this.state.currentChat = chat.id;
                                store.dispatch(
                                    createMoveToChatAction({
                                        chatId: chat.id,
                                    })
                                );
                            },
                            parent: this.state.domElements.list?.getNode(),
                            observe: ['chats'],
                            isCurrent,
                        });

                        this.state.domElements.items.push(chatItem);
                    });

                    if (this.state.isSearching) {
                        this.state.domElements.input?.focus();
                        this.state.isSearching = false;
                    }
                }
            }

            const group = window.document.querySelector(
                '.dropdown-menu__item-group'
            );
            const channel = window.document.querySelector(
                '.dropdown-menu__item-channel'
            );

            group?.addEventListener('click', () => {
                store.dispatch(createMoveToCreateGroupAction());
            });

            channel?.addEventListener('click', () => {
                store.dispatch(createMoveToCreateChannelAction());
            });
        }
    }

    handleSearch(e: KeyboardEvent) {
        e.stopPropagation();
        this.state.isSearching = true;

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

            store.dispatch(createGetChatsAction());
        }
    }

    componentWillUnmount() {
        if (this.state.isMounted) {
            store.dispatch(createDeleteSearchedChatsAction());

            this.state.domElements.items?.forEach((item) => {
                item.componentWillUnmount();
            });
            if (this.state.domElements.items) {
                this.state.domElements.items = [];
            }

            this.state.domElements.list?.componentWillUnmount();
            this.state.domElements.list = null;

            this.unsubscribe();
            this.state.isMounted = false;
        }
    }

    handleClickOpenChat(chat: HTMLElement) {
        const chatStringId = chat.getAttribute('name');

        if (chatStringId) {
            const chatId = parseInt(chatStringId);

            this.props?.chats?.forEach((chat) => {
                if (chat.id === chatId) {
                    store.dispatch(createMoveToChatAction({ chatId }));
                }
            });
        }
    }
}
