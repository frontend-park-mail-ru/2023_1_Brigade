import { Container } from "@containers/container";
import { store } from "@store/store";
import { createGetChatsAction, createGetOneChatAction } from "@/actions/chatActions";
import { DumbChatList } from "@/components/chatList/chatList";
import { createMoveToChatAction, createMoveToCreateGroupAction } from "@/actions/routeActions";
import { STATIC } from "@/config/config";

export interface SmartChatList {
    state: {
        isSubscribed: boolean,
        domElements: {
            chats: HTMLElement | null,
            createBtn: HTMLElement | null,
            dropdownToggle: HTMLElement | null,
            dropdownMenu: HTMLElement | null,
        },
    }
}

export class SmartChatList extends Container {
    constructor(props :componentProps) {
        super(props);
        this.state = {
            isSubscribed: false,
            domElements: {
                chats:  null,
                createBtn: null,
                dropdownToggle: null,
                dropdownMenu: null,
            }
        }

        this.rootNode = STATIC;
    }

    render() {
        if (this.state.isSubscribed && this.props.user) {
            if (!this.props.chats) {
                this.props.chats = [];
            }
            
            const ChatListUI = new DumbChatList(this.props.chats);
            this.rootNode.innerHTML = ChatListUI.render();

            this.state.domElements.dropdownToggle = document.querySelector('.dropdown-toggle');
            this.state.domElements.dropdownMenu = document.querySelector('.dropdown-menu');

            this.state.domElements.dropdownToggle?.addEventListener('click', () => {
                this.state.domElements.dropdownMenu?.classList.toggle('show');
            });
              
            window.addEventListener('click', (event) => {
                if (event.target instanceof Node && !this.state.domElements.dropdownToggle?.contains(event.target)
                    && !this.state.domElements.dropdownMenu?.contains(event.target)) {
                    this.state.domElements.dropdownMenu?.classList.remove('show');
                }
            });

            this.state.domElements.chats = document.querySelector('.chats');
            this.state.domElements.chats?.addEventListener('click', (e) => {
                let chat = e?.target as HTMLElement | null | undefined;
                chat = chat?.closest('.chat-card');
                
                if (chat) {
                    this.handleClickOpenChat(chat);
                    e.preventDefault();
                }
            });

            const group = window.document.querySelector('.dropdown-menu__item-group');
            const channel = window.document.querySelector('.dropdown-menu__item-channel');

            group?.addEventListener('click', () => {
                store.dispatch(createMoveToCreateGroupAction());
            })
            
            channel?.addEventListener('click', () => {
                store.dispatch(createMoveToCreateGroupAction()); // TODO: channel action
            })
        }
    }

    componentDidMount() {
        if (!this.state.isSubscribed) {
            this.unsubscribe.push(store.subscribe(this.constructor.name, (pr: componentProps) => {
                this.props = pr;
    
                this.render();
            }));

            this.state.isSubscribed = true;

            store.dispatch(createGetChatsAction());
        }
    }
    
    componentWillUnmount() {
        if (this.state.isSubscribed) {
            this.unsubscribe.forEach((uns) => uns());
            this.state.isSubscribed = false;
        }
    }

    handleClickOpenChat(chat: HTMLElement) {
        const chatId = chat.getAttribute('name');

        for (const key in this.props.chats) {
            if (this.props.chats[key].id == chatId) {
                store.dispatch(createMoveToChatAction({ chatId: this.props.chats[key].id }));
                break;
            }
        }
    }
}
