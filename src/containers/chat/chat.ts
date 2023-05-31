import { Component } from '@framework/component';
import { store } from '@store/store';
import { DumbChat } from '@components/chat/chat';
import {
    createAddUserInChat,
    createDeleteChatAction,
    createDeleteUserInChat,
    createEditChatAction,
    createGetOneChatAction,
    createIsNotRenderedAction,
    createOpenChatAction,
} from '@actions/chatActions';
import { getWs } from '@utils/ws';
import { DumbEmptyDynamicPage } from '@components/emptyDynamicPage/emptyDynamicPage';
import {
    createMoveToEditChatAction,
    createMoveToHomePageAction,
} from '@actions/routeActions';
import { ChatTypes, MessageActionTypes, MessageTypes } from '@config/enum';
import { DYNAMIC } from '@config/config';
import { DumbMessage } from '@/components/message/message';
import { Popup } from '@/components/popup/popup';
import { Button } from '@/uikit/button/button';
import { List } from '@/uikit/list/list';
import { router } from '@/router/createRouter';

interface Props {
    chatId?: number;
    user?: User;
    openedChat?: OpenedChat;
}

interface State {
    cancelBtn?: Button;
    confirmBtn?: Button;
    btnList?: List;
    chat: DumbChat | undefined;
    isMounted: boolean;
    editingMessage: DumbMessage | undefined;
    domElements: {
        input: HTMLInputElement | null;
        submitBtn: HTMLElement | null;
        deleteBtn: HTMLElement | null;
        editBtn: HTMLElement | null;
        message: HTMLElement | null;
        subscribeBtn: HTMLElement | null;
        leaveGroupBtn: HTMLElement | null;
    };
}

/**
 * Отрисовывает чаты.
 * Прокидывает actions стору для создания диалога, удаление диалога, открыть диалог для просмотра
 * Также подписывается на изменения активного диалога и статуса диалога
 */
export class SmartChat extends Component<Props, State> {
    /**
     * Сохраняет props
     * @param {Object} props - параметры компонента
     */

    private chatId: number | undefined;
    private unsubscribeFromWs: () => void = () => {};
    private popup: Popup | undefined | null;

    constructor(props: Props) {
        super(props);

        this.state = {
            chat: undefined,
            isMounted: false,
            editingMessage: undefined,
            domElements: {
                input: null,
                submitBtn: null,
                deleteBtn: null,
                editBtn: null,
                message: null,
                subscribeBtn: null,
                leaveGroupBtn: null,
            },
        };

        this.chatId = props.chatId;
        this.node = DYNAMIC();

        this.componentDidMount();
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartChat is not mounted');
        }
    }

    /**
     * Рендерит чат
     */
    render() {
        if (this.state.isMounted && this.chatId) {
            if (this.props?.openedChat?.isNotRendered) {
                this.state.chat = new DumbChat({
                    openedChat: this.props.openedChat,
                    userId: this.props?.user?.id ?? 0,
                    userAvatar: this.props?.user?.avatar ?? '',
                    chatAvatar: this.props?.openedChat?.avatar,
                    chatTitle: this.props?.openedChat?.title,
                    chatDescription: this.props?.openedChat?.description,
                    hookOpenedChat: this.hookOpenedChat.bind(this),
                    onDeleteMessage: this.handleDeleteMessage.bind(this),
                    onEditMessage: this.handleEditMessage.bind(this),
                    onSendMessage: this.handleClickSendButton.bind(this),
                });

                if (this.node) {
                    this.node.innerHTML = this.state.chat.render();
                    this.state.chat.setMessageList();
                    this.state.chat.setInput();
                }

                this.state.domElements.input = document.querySelector(
                    '.message-input__text-field__in'
                ) as HTMLInputElement;
                this.state.domElements.submitBtn = document.querySelector(
                    '.view-chat__send-message-button'
                );
                this.state.domElements.deleteBtn =
                    document.querySelector('.delete-btn');
                this.state.domElements.editBtn =
                    document.querySelector('.edit-btn');
                this.state.domElements.subscribeBtn =
                    document.querySelector('.subscribe-btn');
                this.state.domElements.leaveGroupBtn = document.querySelector(
                    '.view-chat__header__icons__leave-group'
                );

                this.state.domElements.leaveGroupBtn?.addEventListener(
                    'click',
                    () => {
                        const updateMembers = this.props?.openedChat?.members
                            .map((member: { id: number }) => {
                                return member.id;
                            })
                            .filter((id: number) => {
                                return id !== this.props?.user?.id;
                            });

                        if (this.props.openedChat) {
                            const updateChannelState = {
                                id: this.props.openedChat.id,
                                type: ChatTypes.Channel,
                                title: this.props.openedChat.title,
                                members: updateMembers ?? [],
                            };

                            async function updateChannelAndMoveToHomePage() {
                                store.dispatch(createDeleteUserInChat());
                                await store.dispatch(
                                    createEditChatAction(updateChannelState)
                                );
                                store.dispatch(createOpenChatAction(undefined));
                                store.dispatch(createMoveToHomePageAction());
                            }

                            updateChannelAndMoveToHomePage();
                        }
                    }
                );

                this.state.domElements?.subscribeBtn?.addEventListener(
                    'click',
                    () => {
                        if (
                            this.state.domElements.subscribeBtn?.textContent ===
                            'Subscribe'
                        ) {
                            this.state.domElements.subscribeBtn.textContent =
                                'Unsubscribe';
                            if (this.props.user) {
                                store.dispatch(
                                    createAddUserInChat(this.props.user)
                                );
                            }
                        } else if (
                            this.state.domElements.subscribeBtn?.textContent ===
                            'Unsubscribe'
                        ) {
                            this.state.domElements.subscribeBtn.textContent =
                                'Subscribe';
                            store.dispatch(createDeleteUserInChat());
                            // router.route('/');
                        }

                        if (this.props.openedChat) {
                            const updateMembers =
                                this.props.openedChat.members.map(
                                    (member: { id: number }) => {
                                        return member.id;
                                    }
                                );

                            const updateChannelState = {
                                id: this.props.openedChat.id,
                                type: ChatTypes.Channel,
                                title: this.props.openedChat.title,
                                members: updateMembers,
                            };

                            store.dispatch(
                                createEditChatAction(updateChannelState)
                            );
                        }
                    }
                );

                this.state.domElements.deleteBtn?.addEventListener(
                    'click',
                    (e) => {
                        e.preventDefault();

                        this.handleClickDeleteButton();
                    }
                );

                if (
                    this.props.openedChat.type === ChatTypes.Group ||
                    (this.props.openedChat.type === ChatTypes.Channel &&
                        this.props?.user?.id ===
                            this.props?.openedChat?.master_id)
                ) {
                    this.state.domElements.editBtn?.addEventListener(
                        'click',
                        () => {
                            this.handleClickEditButton();
                        }
                    );
                }

                // Открытие вложений
                document
                    .querySelector('.view-chat__header__companion')
                    ?.addEventListener('click', () => {
                        this.state.chat?.toggleAttachmentList();
                    });

                store.dispatch(createIsNotRenderedAction());

                this.unsubscribe();

                this.state.domElements?.input?.focus();
            }
        }
    }

    renderIncomingMessage(message: Message) {
        if (message.chat_id !== this.props.openedChat?.id) {
            return;
        }

        if (message.action === MessageActionTypes.Create) {
            this.state.chat?.addMessage(
                document.querySelector('.view-chat__messages') as HTMLElement,
                message
            );
        }

        // switch (message.action) {
        //     case MessageActionTypes.Edit:
        //         store.dispatch(createEditMessageAction(message));
        //         break;
        //     case MessageActionTypes.Delete:
        //         store.dispatch(createDeleteMessageAction(message));
        //         break;
        //     case MessageActionTypes.Create:
        //         store.dispatch(createAddMessageAction(message));

        //         this.state.chat?.addMessage(
        //             document.querySelector(
        //                 '.view-chat__messages'
        //             ) as HTMLElement,
        //             message
        //         );
        // }
    }

    handleClickSendButton(message: {
        type: MessageTypes;
        body: string;
        attachments: {
            url: string;
            name: string;
        }[];
    }) {
        if (this.chatId && this.props.user) {
            if (
                this.state.editingMessage &&
                message.type !== MessageTypes.Sticker
            ) {
                getWs().send({
                    id: this.state.editingMessage?.getMessage().id,
                    action: MessageActionTypes.Edit,
                    type: message.type,
                    attachments: message.attachments,
                    body: message.body,
                    author_id: this.props.user.id,
                    chat_id: this.chatId,
                    created_at: '',
                });

                this.state.editingMessage = undefined;
            } else {
                getWs().send({
                    id: '',
                    action: MessageActionTypes.Create,
                    type: message.type,
                    attachments: message.attachments,
                    body: message.body,
                    author_id: this.props.user.id,
                    chat_id: this.chatId,
                    created_at: '',
                });
            }
        }
    }

    handleDeleteMessage(message: DumbMessage) {
        if (!this.chatId) {
            console.error('undefined chatId');
            return;
        }

        if (!this.props.user) {
            return;
        }

        getWs().send({
            id: message.getMessage().id,
            action: MessageActionTypes.Delete,
            type: MessageTypes.notSticker,
            attachments: [],
            body: '',
            author_id: this.props.user.id,
            chat_id: this.chatId,
            created_at: '',
        });
    }

    handleEditMessage(message: DumbMessage) {
        this.state.editingMessage = message;

        this.state.chat?.getInput()?.setMessage(message.getMessage());
        this.state.domElements.input?.focus();
    }

    handleClickEditButton() {
        if (this.props.openedChat) {
            store.dispatch(createMoveToEditChatAction(this.props.openedChat));
        }
    }

    componentDidMount() {
        if (!this.state.isMounted) {
            if (this.chatId) {
                this.unsubscribeFromWs = getWs().subscribe(
                    this.chatId,
                    this.renderIncomingMessage.bind(this)
                );

                this.unsubscribe = store.subscribe(
                    this.constructor.name,
                    (props: StoreState) => {
                        if (!props.user || !props.openedChat) {
                            return;
                        }

                        this.props = {
                            chatId: this.props.chatId,
                            user: props.user,
                            openedChat: props.openedChat,
                        };

                        this.render();
                    }
                );

                if (this.state.isMounted === false) {
                    this.state.isMounted = true;
                }

                store.dispatch(createGetOneChatAction({ chatId: this.chatId }));
            } else {
                const emptyUI = new DumbEmptyDynamicPage({
                    ...this.props,
                });

                if (this.node) {
                    this.node.innerHTML = emptyUI.render();
                }

                if (this.state.isMounted === false) {
                    this.state.isMounted = true;
                }
            }
        }
    }

    hookOpenedChat(state: StoreState): OpenedChat | undefined {
        return state.openedChat ?? undefined; // store.getState();
    }

    componentWillUnmount() {
        if (this.state.isMounted) {
            this.unsubscribe();
            this.unsubscribeFromWs();
            this.state.chat?.destroy();
            this.state.isMounted = false;
        }
    }

    handleClickDeleteButton() {
        const root = document.getElementById('root');
        if (!this.popup) {
            this.popup = new Popup({
                parent: root as HTMLElement,
                title: 'Вы действительно хотите удалить чат?',
                className: 'popup__container',
            });

            const popContent: HTMLElement | null = document.querySelector(
                '.popup__content'
            ) as HTMLElement;

            if (popContent) {
                this.state.btnList = new List({
                    parent: popContent,
                    className: 'popup__btn-list',
                });

                this.state?.btnList.getNode()?.classList.remove('list');

                this.state.confirmBtn = new Button({
                    parent: this.state.btnList.getNode() as HTMLElement,
                    className: 'popup__btn confirm__btn button-S',
                    label: 'Подтвердить',
                    onClick: () => {
                        store.dispatch(
                            createDeleteChatAction(this.props?.openedChat?.id)
                        );
                        router.route('/');
                        this.popup?.destroy();
                        this.popup = null;
                    },
                });

                this.state.cancelBtn = new Button({
                    parent: this.state.btnList.getNode() as HTMLElement,
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
}
