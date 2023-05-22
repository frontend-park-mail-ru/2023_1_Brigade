import { Component } from '@framework/component';
import { store } from '@store/store';
import { addErrorToClass, checkNickname } from '@utils/validator';
import { countingMembersErrorTypes, nicknameErrorTypes } from '@config/errors';
import { DumbCreateGroup } from '@components/createGroup/createGroup';
import { createCreateGroupAction } from '@actions/groupActions';
import { ChatTypes } from '@config/enum';
import { createGetContactsAction } from '@actions/contactsActions';
import { createMoveToChatsAction } from '@actions/routeActions';
import { DYNAMIC } from '@config/config';

interface Props {
    user?: User;
    contacts?: User[];
}

interface State {
    isMounted: boolean;
    domElements: {
        groupNameLabel: HTMLElement | null;
        groupNameInput: HTMLInputElement | null;
        buttonCreateGroup: HTMLElement | null;
        contacts: HTMLElement | null;
    };
    valid: {
        groupNameIsValid: boolean;
        countersMembers: boolean;
        isValid: () => boolean | undefined;
    };
}

/**
 * Отрисовывает логин.
 * Прокидывает actions в стору для логина
 * Также подписывается на изменения статуса логина,
 * для корректного рендера ошибки
 *
 */
export class SmartCreateGroup extends Component<Props, State> {
    /**
     * Cохраняет props
     * @param {Object} props - параметры компонента
     */

    #contactClicked = 'rgb(37, 37, 48)';
    #contactUnClicked = 'rgb(28, 28, 36)';

    private readonly newProperty = this;

    constructor(props: Record<string, unknown>) {
        super(props);

        this.state = {
            isMounted: false,
            domElements: {
                groupNameLabel: null,
                groupNameInput: null,
                buttonCreateGroup: null,
                contacts: null,
            },
            valid: {
                groupNameIsValid: false,
                countersMembers: false,
                isValid: () => {
                    return (
                        this.state.valid.groupNameIsValid &&
                        this.state.valid.countersMembers
                    );
                },
            },
        };

        this.node = DYNAMIC();

        this.componentDidMount();
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartCreateGroup is not mounted');
        }
    }

    /**
     * Рендерит создание группы
     */
    render() {
        if (this.state.isMounted) {
            const CreateGroupUI = new DumbCreateGroup({
                contacts: this.props?.contacts ?? [],
            });

            if (this.node) {
                this.node.innerHTML = CreateGroupUI.render();
            }

            document.querySelectorAll('.contact').forEach((ct) => {
                const contact = ct as HTMLElement;
                contact.style.backgroundColor = this.#contactUnClicked;

                contact.addEventListener('click', (e) => {
                    e.preventDefault();

                    this.handleClickChooseContact(contact);
                });
            });

            this.state.domElements.buttonCreateGroup =
                document.querySelector('.button-submit');
            this.state.domElements.buttonCreateGroup?.addEventListener(
                'click',
                (e) => {
                    e.preventDefault();

                    this.validateChoseContacts();
                    this.handleClickCreateGroup();
                }
            );

            this.state.domElements.groupNameInput =
                document.querySelector('.groupName');
            this.state.domElements.groupNameInput?.addEventListener(
                'input',
                (e) => {
                    e.preventDefault();

                    this.validateGroupName();
                }
            );
        }
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

    /**
     * Обрабатывает нажатие кнопки создания чата
     */
    handleClickCreateGroup() {
        if (this.state.valid.isValid()) {
            const contacts = [...this.getChoseContacts(), this.props?.user?.id];

            const chat = {
                type: ChatTypes.Group,
                title: this.state.domElements.groupNameInput?.value,
                members: contacts,
            };

            store.dispatch(createCreateGroupAction(chat));
            store.dispatch(createMoveToChatsAction());
        }
    }

    /**
     * Навешивает переданные обработчики на валидацию и кнопки
     */
    componentDidMount() {
        if (!this.state.isMounted) {
            this.unsubscribe = store.subscribe(
                this.constructor.name,
                (props: Props) => {
                    this.props = props;

                    this.newProperty.render();
                }
            );

            if (this.state.isMounted === false) {
                this.state.isMounted = true;
            }
        }

        store.dispatch(createGetContactsAction());
    }

    /**
     * Удаляет все подписки
     */
    componentWillUnmount() {
        if (this.state.isMounted) {
            this.unsubscribe();
            this.state.isMounted = false;
        }
    }

    /**
     * Проверяет, что для создания группы выбрано > 0 участников
     */
    validateChoseContacts() {
        this.state.domElements.groupNameInput?.classList.remove(
            'data-input--error'
        );
        addErrorToClass('', countingMembersErrorTypes);

        const contacts = this.getChoseContacts();

        if (contacts.length === 0) {
            this.state.domElements.groupNameInput?.classList.add(
                'data-input--error'
            );
            addErrorToClass(
                'incorrect-emptyCountingMembers',
                countingMembersErrorTypes
            );
            if (this.state.valid.countersMembers) {
                this.state.valid.countersMembers = false;
            }
            return;
        }

        if (this.state.valid.countersMembers === false) {
            this.state.valid.countersMembers = true;
        }
    }

    /**
     * Проверяет пользовательский ввод названия чата
     */
    validateGroupName() {
        this.state.domElements.groupNameInput?.classList.remove(
            'data-input--error'
        );
        addErrorToClass('', nicknameErrorTypes);

        const { isError, errorClass } = checkNickname(
            this.state.domElements.groupNameInput?.value ?? ''
        );

        if (isError) {
            this.state.domElements.groupNameInput?.classList.add(
                'data-input--error'
            );
            addErrorToClass(errorClass, nicknameErrorTypes);
            if (this.state.valid.groupNameIsValid) {
                this.state.valid.groupNameIsValid = false;
            }
            return;
        }

        if (this.state.valid.groupNameIsValid === false) {
            this.state.valid.groupNameIsValid = true;
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
