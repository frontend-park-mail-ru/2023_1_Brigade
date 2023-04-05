import { Container } from "@containers/container";
// import { DumbLogin } from "@/pages/login/login";
// import { checkEmail, checkPassword, addErrorToClass } from "@/utils/validator";
import { store } from "@/store/store";
// import { emailErrorTypes, passwordErrorTypes } from "@/config/errors";
// import { createLoginAction } from "@/actions/authActions";
import { createCreateGroupAction } from "@/actions/createGroupActions";
import {DumbCreateGroup} from "@components/create_group/create_group";
import {constructor} from "image-minimizer-webpack-plugin";
import {createGroup} from "@utils/api";


export interface SmartCreateGroup {
    state: {
        isSubscribed: boolean,
        domElements: {
            groupNameLabel:    HTMLElement      | null,
            groupNameInput:    HTMLInputElement | null,
            buttonCreateGroup: HTMLElement      | null,
            contacts:          HTMLElement      | null,
        },
        valid: {
            groupNameIsValid: boolean,
            countersMembers:  boolean,
            isValid: () => boolean,
        },
    }
}

/**
 * Отрисовывает логин.
 * Прокидывает actions в стору для логина
 * Также подписывается на изменения статуса логина,
 * для корректного рендера ошибки
 *
 */
export class SmartCreateGroup extends Container {
    /**
     * Cохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props :componentProps) {
        super(props);

        this.state = {
            isSubscribed: false,
            domElements: {
                groupNameLabel:    null,
                groupNameInput:    null,
                buttonCreateGroup: null,
                contacts:          null,
            },
            valid: {
                groupNameIsValid: false,
                countersMembers:  false,
                isValid: () => {
                    return this.state.valid.groupNameIsValid &&
                           this.state.valid.countersMembers;
                },
            },
        };
    }

    /**
     * Рендерит логин
     */
    render() {
         if (!this.state.isSubscribed) {
            const CreateGroupUI = new DumbCreateGroup({
                ...this.props,
            });

            this.state.domElements.contacts = document.querySelector('.contact');
            this.state.domElements.contacts?.addEventListener('click', (e) => {
                console.log('ok')
                e.preventDefault();
                // e.target.
                // e.
                console.log(e.target)
                this.handleClickChooseContact();
            });

            // console.log(CreateGroupUI.render())

             // this.rootNode = CreateGroupUI.render()

             this.rootNode.innerHTML = CreateGroupUI.render();

             // document.querySelector('#root')?.innerHTML = CreateGroupUI.render()
         }
    }

    /**
     * Отправка запроса на сервер
     */
    handleClickCreateGroup() {
        if (this.state.valid.isValid()) {
            const group = {
                title: this.state.domElements.groupNameInput?.value,

                // password: this.state.domElements.password?.value,
            } as anyObject;
            store.dispatch(createCreateGroupAction(group));
        }
    }

    /**
     * Выбор контакта из списка контактов
     */
    handleClickChooseContact() {
        this.state.domElements.contacts.addEventListener('click', () => {
            this.state.domElements.contacts.style.backgroundColor = 'red'; // изменяем цвет на красный
        });
    }
    // handleClickChooseContact() {
    //     // classLi
    //     // this
    //     // const element = document.querySelector('.contact')
    //     // element.
    // }

    /**
     * Проверяет пользовательский ввод имени группы
     */
    validateGroupName() {
    }

    /**
     * Навешивает переданные обработчики на валидацию и кнопки
     */
    componentDidMount() {
        if (!this.state.isSubscribed) {
            this.unsubscribe.push(store.subscribe(this.name, (pr: componentProps) => {
                this.props = pr;

                this.render();
            }));

            this.state.isSubscribed = true;
        }

        // store.dispatch(createRenderAction());
    }

    /**
     * Удаляет все подписки
     */
    componentWillUnmount() {
        this.unsubscribe.forEach((uns) => uns());
        this.state.isSubscribed = false;
    }
}
