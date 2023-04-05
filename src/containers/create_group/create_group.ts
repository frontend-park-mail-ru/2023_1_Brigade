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
import {compileString} from "sass";
import {bind} from "express";


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

    #contactClicked  = 'red';
    #contactUnclicked= 'rgb(28, 28, 36)';

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
             console.log(this.props)
            const CreateGroupUI = new DumbCreateGroup({
                ...this.props,
            });


             // const myList = document.querySelector(".contacts__contacts");

             // myList.addEventListener("click", (event: MouseEvent) => {
             //     // const clickedItem = event.target (https://event.target/) as HTMLElement;
             //     // console.log("Clicked item: " + clickedItem.textContent);
             //
             // });

            this.rootNode.innerHTML = CreateGroupUI.render();


             // this.state.domElements.contacts = document.querySelector('.contacts__contacts');
             // this.state.domElements.saveButton?.addEventListener('click', (e) => {
             //     e.preventDefault();
             //
             //     this.handleClickSave();
             // });
             document.querySelectorAll('.contact').forEach(function(contact: any) {
                 contact.style.backgroundColor = this.#contactUnclicked;
                 contact.addEventListener('click', (e: any) => {
                     e.preventDefault()

                    this.handleClickChooseContact(contact)
                 });
             }.bind(this));
            // this.state.domElements.contacts?.addEventListener('click', (e) => {
            //     e.preventDefault();
            //     const contact = e.target as HTMLElement;
            //     console.log(contact)
            //     this.handleClickChooseContact();
            // });

            // console.log(CreateGroupUI.render())

             // this.rootNode = CreateGroupUI.render()


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
    handleClickChooseContact(contact: any) {
        if (contact.style.backgroundColor == this.#contactUnclicked) {
            contact.style.backgroundColor = this.#contactClicked;
        } else {
            contact.style.backgroundColor = this.#contactUnclicked;
        }
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
