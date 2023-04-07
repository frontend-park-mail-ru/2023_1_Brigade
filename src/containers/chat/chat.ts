import { Container } from "@containers/container";
import { store } from "@/store/store";
import { DumbChat } from "@/components/chat/chat";
import { createRenderAction } from "@/actions/routeActions";
import { Message } from "@/components/message/message";
import { createNewMessageAction } from "@/actions/chatActions";


export interface SmartChat {
    state: {
        isSubsribed: boolean,
        domElements: {
            submitBtn: HTMLElement | null;
        }
    }
}

/**
 * Отрисовывает чаты.
 * Прокидывает actions стору для создания диалога, удаление диалога, открыть диалог для просмотра
 * Также подписывается на изменения активного диалога и статуса диалога
 */
export class SmartChat extends Container {
    /**
     * Сохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props: componentProps) {
        super(props);
        this.state = {
            isSubsribed: false,
            domElements: {
                submitBtn: null,
            }
        }
    }

    /**
     * получаем объект открытого чата
     * @returns {Object} - объект открытого чата
     */
    #getOpenChat() : Object | null {
        const openedChats = this.props.openedChats;

        for (let i = 0; i < openedChats.length; ++i) {
            if (openedChats[i].id === this.props.openChatNow) {
                return openedChats[i];
            }
        }

        return null;
    }

    /**
     * Рендерит чат
     */
    render() {
        if (this.state.isSubsribed) {
            const openChat = this.#getOpenChat();
            if (openChat) {
                const chat = new DumbChat({chatData: openChat});
                this.rootNode.innerHTML = chat.render();
            }

            this.state.domElements.submitBtn = document.querySelector('.view-chat__send-message-button');
            this.state.domElements.submitBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                const sendBtn = e.target as HTMLElement;

                this.handleClickSendButton(sendBtn);
            })
        }
    }

    handleClickSendButton(sendBtn: HTMLElement) {
        const input = document.querySelector('.input-message__text-field__in') as HTMLInputElement;
        if (input.value) {
            const message = {
                // id: 0, // какой номер у нового id должен быть ?
                body: input.value,
                // chatId: 0, // какой номер у нового id должен быть ?
                // author_id: 0, // какой номер у нового id должен быть ?
            }

            console.log('input value: ', input.value);
            store.dispatch(createNewMessageAction(message));
        }
        input.value = '';
    }

    componentDidMount() {
        if (!this.state.isSubsribed) {
            this.unsubscribe.push(store.subscribe(this.name, (pr: componentProps) => {
                this.props = pr;
                
                this.render();
            }))

            this.state.isSubsribed = true;
            store.dispatch(createRenderAction());
        }
    }

    componentWillUnmount() {
        this.unsubscribe.forEach((uns) => uns());
        this.state.isSubsribed = false;
    }
}