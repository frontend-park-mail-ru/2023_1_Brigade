import { Component } from "@/components/component";
import { DumbContact } from "@components/contact/contact"
import { whiteButtonUI } from "@components/ui/white-button/white-button"

import template from "@components/contacts/contacts.pug";
import "@components/contacts/contacts.scss"

export class DumbContacts extends Component {
    constructor(props: any) {
        super(props);
    }

    getContactsList() {
        let contactsList: string[] = [];

        for (const key in this.props) {
            const contactUI = new DumbContact(this.props[key]);

            contactsList.push(contactUI.render());
        }

        return contactsList;
    }

    render() {
        return template({
            headContacts: 'Контакты',
            contacts: this.getContactsList(),
            addContactButton: whiteButtonUI.renderTemplate({
                className: 'add-contact-button',
                buttonValue: 'Добавить контакт',
            }),
        });
    }
}
