import { DYNAMIC } from '@config/config';
import { store } from '@store/store';
import { Component } from '@framework/component';
import { DumbCreateChannel } from '@components/channelCreation/channel';
import {
    createMoveToChatsAction,
    createMoveToHomePageAction,
} from '@actions/routeActions';
import { addErrorToClass, checkNickname } from '@utils/validator';
import { nicknameErrorTypes } from '@config/errors';
import { ChatTypes } from '@config/enum';
import { createCreateChannelAction } from '@actions/chatActions';
import { DumbProfile } from '@/components/new-profile/profile';
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
            avatarOnClick: this.avatarOnClick,
            backOnClick: this.backOnClick,
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

    // /**
    //  * Обрабатывает нажатие кнопки аватарки
    //  */
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

    // handleClickDone() {
    //     if (this.state.valid.isValid() && this.props.user) {
    //         const newChannel = {
    //             type: ChatTypes.Channel,
    //             title: this.state.domElements.channelName?.value,
    //             members: [this.props.user.id],
    //             // TODO: когда на бэке сделают ручки
    //             // avatar: this.state.domElements.channelImage,
    //             // description: this.state.domElements.channelDescription?.value,
    //             // master_id: this.props.user.id,
    //         } as Record<string, unknown>;

    //         store.dispatch(createCreateChannelAction(newChannel));
    //         store.dispatch(createMoveToChatsAction());
    //         // TODO: store.dispatch(createChannelAvatarAction(this.#image));
    //     }
    // }

    /**
    //  * Проверяет пользовательский ввод
    //  */
    // validateChannelName(validateInput: HTMLInputElement | null) {
    //     validateInput?.classList.remove('data-input--error');
    //     addErrorToClass('', nicknameErrorTypes);

    //     const { isError, errorClass } = checkNickname(
    //         validateInput?.value ?? ''
    //     );

    //     if (isError) {
    //         validateInput?.classList.add('data-input--error');
    //         addErrorToClass(errorClass, nicknameErrorTypes);
    //         this.state.valid.channelNameIsValid = false;

    //         return;
    //     }

    //     this.state.valid.channelNameIsValid = true;
    // }
}
