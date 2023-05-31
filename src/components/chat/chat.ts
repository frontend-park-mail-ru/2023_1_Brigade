import template from '@components/chat/chat.pug';
import '@components/chat/chat.scss';
import { Component } from '@framework/component';
import { svgButtonUI } from '@/components/ui/icon/button';
import { chatAvatarUi } from '@components/ui/chatAvatar/chatAvatar';
import { ChatTypes, MessageTypes } from '@config/enum';
import { DumbMessage } from '@components/message/message';
import { MessageInput } from '@components/message-input/message-input';
import { List } from '@uikit/list/list';
import { Attachment } from '@components/attachment/attachment';
import { store } from '@/store/store';

interface Props {
    openedChat: OpenedChat;
    chatAvatar: string;
    chatTitle: string;
    chatDescription: string;
    userId: number;
    userAvatar: string;
    hookOpenedChat(state: StoreState): OpenedChat | undefined;
    onDeleteMessage: (message: DumbMessage) => void;
    onEditMessage: (message: DumbMessage) => void;
    onSendMessage: (message: {
        type: MessageTypes;
        body: string;
        attachments: {
            url: string;
            name: string;
        }[];
    }) => void;
}

interface State {
    isMounted: boolean;
    attachmentsIsMounted: boolean;
    messages: DumbMessage[];
    messageInput: MessageInput | undefined;
    attachmentsList: List | undefined;
    attachments: Attachment[];
}

export class DumbChat extends Component<Props, State> {
    private editBtn: string;
    private deleteChatBtn: string;
    private channelInput: string;
    private subscribeBtnText: string;
    private leaveGroup: string;

    constructor(props: Props) {
        super(props);
        this.state = {
            isMounted: false,
            attachmentsIsMounted: false,
            messages: [],
            messageInput: undefined,
            attachmentsList: undefined,
            attachments: [],
        };
        this.editBtn = '';
        this.deleteChatBtn = '';
        this.channelInput = '';
        this.subscribeBtnText = '';
        this.leaveGroup = '';
    }

    destroy() {
        this.state.messages.forEach((message) => message.destroy());
        this.state.attachments.forEach((attachments) => attachments.destroy());
        this.state.attachmentsList?.destroy();
        this.state.messageInput?.destroy();
        this.state.isMounted = false;
    }

    update() {
        // if (this.state.isMounted) {
        //     const prevNode = this.node;
        //     this.componentWillUnmount();
        //     this.node = this.render() as HTMLElement;
        //     this.componentDidMount();
        //     prevNode?.replaceWith(this.node);
        // } else {
        //     console.error('Chat is not mounted');
        // }
    }

    componentDidMount(): void {
        this.unsubscribe = store.subscribe(this.constructor.name, (state) => {
            const prevProps = { ...this.props };
            const newOpenedChatState = this.props.hookOpenedChat(state);
            if (newOpenedChatState) {
                this.props.openedChat = newOpenedChatState;
            }

            if (this.props.openedChat !== prevProps.openedChat) {
                this.update();
            }
        });
    }

    componentWillUnmount(): void {
        this.unsubscribe();
        // TODO: destroy
    }

    getAuthor(message: Message) {
        let author: User | undefined = undefined;

        for (const member of this.props.openedChat.members) {
            if (
                member.id === message.author_id &&
                member.id !== this.props.userId
            ) {
                author = member;
            }
        }

        return author;
    }

    addMessage(parent: HTMLElement, message: Message) {
        const messageComponent = new DumbMessage({
            message,
            hookMessage: (state) => {
                const index = state.openedChat?.messages.findIndex(
                    (newMessage) => newMessage.id === message.id
                );

                return (index && index !== -1) || index === 0
                    ? state.openedChat?.messages[index]
                    : undefined;
            },
            user:
                this.props.openedChat.type === ChatTypes.Group
                    ? this.getAuthor(message)
                    : undefined,
            place: message.author_id === this.props.userId ? 'right' : 'left',
            onDelete:
                message.author_id === this.props.userId
                    ? this.props.onDeleteMessage
                    : undefined,
            onEdit:
                message.author_id === this.props.userId
                    ? this.props.onEditMessage
                    : undefined,
            parent,
        });

        this.state.messages.push(messageComponent);
    }

    setMessageList() {
        const parent = document.querySelector(
            '.view-chat__messages'
        ) as HTMLElement;
        if (!parent) {
            return;
        }

        this.props.openedChat?.messages?.forEach((message) => {
            this.addMessage(parent, message);
        });
    }

    addAttachment(parent: HTMLElement, message: Message) {
        if (
            message.type === MessageTypes.Sticker ||
            message.attachments.length < 1
        ) {
            return;
        }

        message.attachments.forEach((attachment) => {
            const attachmentComponent = new Attachment({
                src: attachment,
                isSticker: MessageTypes.notSticker,
                hookAttachment: (state) => {
                    const index = state.openedChat?.messages.findIndex(
                        (newMessage) => newMessage.id === message.id
                    );

                    const mes =
                        (index && index !== -1) || index === 0
                            ? state.openedChat?.messages[index]
                            : undefined;

                    if (!mes) {
                        return undefined;
                    }

                    const attIndex = mes.attachments.findIndex(
                        (att) => att.url === attachment.url
                    );

                    const att =
                        (attIndex && attIndex !== -1) || attIndex === 0
                            ? mes.attachments[attIndex]
                            : undefined;
                    return att;
                },
                parent,
            });

            this.state.attachments.push(attachmentComponent);
        });
    }

    toggleAttachmentList() {
        if (this.state.attachmentsIsMounted) {
            document
                .querySelector('.attachments')
                ?.classList.toggle('attachments--disabled');

            setTimeout(() => {
                this.state.attachments.forEach((attachment) =>
                    attachment.destroy()
                );
                this.state.attachments = [];

                this.state.attachmentsList?.destroy();
                this.state.attachmentsList = undefined;
                this.state.attachmentsIsMounted = false;
            }, 125);
        } else {
            let parent = document.querySelector('.attachments') as HTMLElement;
            if (!parent) {
                return;
            }

            this.state.attachmentsList = new List({
                className: 'attachments__list',
                parent,
            });

            parent = this.state.attachmentsList?.getNode() as HTMLElement;
            if (!parent) {
                return;
            }

            this.props.openedChat?.messages?.forEach((message) => {
                this.addAttachment(parent, message);
            });

            document
                .querySelector('.attachments')
                ?.classList.toggle('attachments--disabled');

            this.state.attachmentsIsMounted = true;
        }
    }

    setInput() {
        if (this.channelInput !== '') {
            const parent = document.querySelector(
                '.view-chat__message-input'
            ) as HTMLElement;

            this.state.messageInput = new MessageInput({
                onSend: this.props.onSendMessage,
                parent,
            });
        }
    }

    getInput() {
        return this.state.messageInput;
    }

    private checkRights(master_id: number | undefined): boolean {
        if (master_id == this.props?.userId) {
            return true;
        }

        return false;
    }

    /**
     *
     * @returns {Boolean} - состоит ли пользователь в канале
     */
    private isMember(): boolean {
        const members: User[] | undefined =
            store.getState().openedChat?.members;
        if (members) {
            for (const member of members) {
                if (member.id === this.props.userId) {
                    return true;
                }
            }
        }

        return false;
    }

    render() {
        const openedChat = store.getState().openedChat;
        let master_id = 0;
        if (openedChat) {
            master_id = openedChat.master_id;
        }

        if (this.props.openedChat.type === ChatTypes.Dialog) {
            this.channelInput = 'yes';
            this.deleteChatBtn = 'delete-btn';
        }
        if (this.props.openedChat.type === ChatTypes.Group) {
            if (this.checkRights(master_id)) {
                this.editBtn = 'edit-chat';
                this.deleteChatBtn = 'delete-btn';
            } else {
                this.leaveGroup = 'Выйти из группы';
            }

            this.channelInput = 'yes';
        }
        if (this.props.openedChat.type === ChatTypes.Channel) {
            if (this.isMember()) {
                this.subscribeBtnText = 'Unsubscribe';
            } else {
                this.subscribeBtnText = 'Subscribe';
            }

            if (this.checkRights(master_id)) {
                this.editBtn = 'edit-chat';
                this.deleteChatBtn = 'delete-btn';
                this.channelInput = 'yes';
            }
        }

        this.state.isMounted = true;

        return template({
            EditBtn: svgButtonUI.renderTemplate({ svgClassName: this.editBtn }),
            LeaveGroupBtn: this.leaveGroup,
            SendMessageBtn: svgButtonUI.renderTemplate({
                svgClassName: 'view-chat__send-message-button',
            }),
            DeleteChatBtn: svgButtonUI.renderTemplate({
                svgClassName: this.deleteChatBtn,
            }),
            HeaderUserAvatar: chatAvatarUi.renderTemplate({
                ClassName: 'header__companion__ava',
                PathToUserImage: this.props?.chatAvatar ?? '',
                UserName: this.props?.chatTitle ?? '',
                UserStatus: this.props.chatDescription ?? '',
                Online: false,
            }),
            Subscriberes: this.props?.openedChat?.members?.length,
            // Input: this.channelInput,
            SubsribeBtnText: this.subscribeBtnText,
        });
    }
}
