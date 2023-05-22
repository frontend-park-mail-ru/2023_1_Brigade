import { Component } from '@framework/component';
import template from '@components/chatList/chatList.pug';
import '@components/chatList/chatList.scss';
import { DumbChatCard } from '@components/chatCard/chatCard';
import { searchUi } from '@components/search/search';
import { Dropdown } from '@components/dropdown/dropdown';

interface Props {
    chats: Chat[];
}

interface State {
    isMounted: boolean;
}

export class DumbChatList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    destroy() {}

    componentDidMount(): void {
        //TODO
    }

    componentWillUnmount(): void {
        //TODO
    }

    getChatList() {
        const chatsList: string[] = [];

        this.props?.chats.forEach((chat) => {
            const chatCardUI = new DumbChatCard({ chat });

            chatsList.push(chatCardUI.render());
        });

        return chatsList;
    }

    render() {
        return template({
            headChats: 'Чаты',
            dropdown: new Dropdown({
                icon: 'create-btn',
                list: [
                    {
                        className: 'dropdown-menu__item-group',
                        value: 'Создать группу',
                    },
                    {
                        className: 'dropdown-menu__item-channel',
                        value: 'Создать канал',
                    },
                ],
            }).render(),
            chatInput: new searchUi({
                inputClassName: 'chats__header__input',
                placeholder: 'Поиск',
            }).render(),
            chats: this.getChatList(),
        });
    }
}
