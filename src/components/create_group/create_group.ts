import { Component } from "@/components/component";
import { DumbContact } from "@components/contact/contact"
import { whiteButtonUI } from "@components/ui/white-button/white-button"
import { smallEllipseIconUI } from "@components/ui/small-ellipse-icon/small-ellipse-icon";

import template from "@components/create_group/create_group.pug";
import "@components/create_group/create_group.scss"
import {dataInputUI} from "@components/ui/data-input/data-input";
import {blueButtonUI} from "@components/ui/blue-button/blue-button";
import {DumbContacts} from "@components/contacts/contacts";

export class DumbCreateGroup extends Component {
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
            groupNameLabel: 'Название группы',
            groupNameInput: dataInputUI.renderTemplate({
                className: 'groupName',
                inputType: 'text',
                inputPlaceholder: '',
                value: '',
            }),
            buttonCreateGroup: blueButtonUI.renderTemplate({
                className: 'button-submit',
                buttonValue: 'Создать группу',
            }),
            headContacts: 'Контакты',
            contacts: this.getContactsList(),
        });
    }
}
