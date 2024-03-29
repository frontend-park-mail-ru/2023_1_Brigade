import { Component } from '@framework/component';
import { DumbContact } from '@components/contact/contact';

import template from '@components/contacts/contacts.pug';
import '@components/contacts/contacts.scss';
import { searchUi } from '@components/search/search';
import { Dropdown } from '../dropdown/dropdown';

interface Props {
    contacts: User[];
}

interface State {
    isMounted: boolean;
}

export class DumbContacts extends Component<Props, State> {
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

    getContactsList() {
        const contactsList: string[] = [];

        this.props?.contacts.forEach((contact) => {
            const contactUI = new DumbContact({ contact });

            contactsList.push(contactUI.render());
        });

        return contactsList;
    }

    render() {
        return template({
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
            contactInput: new searchUi({
                inputClassName: 'contacts__header__input',
                placeholder: 'Поиск',
            }).render(),
            contacts: this.getContactsList(),
        });
    }
}
