import { Component } from '@framework/component';
import { DumbContact } from '@components/contact/contact';
import template from '@components/createGroup/createGroup.pug';
import '@components/createGroup/createGroup.scss';
import '@components/group/group.scss';
import { dataInputUI } from '@components/ui/data-input/data-input';
import { blueButtonUI } from '@components/ui/blue-button/blue-button';

interface Props {
    contacts?: User[];
}

interface State {
    isMounted: boolean;
}

export class DumbCreateGroup extends Component<Props, State> {
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

        this.props?.contacts?.forEach((contact) => {
            const contactUI = new DumbContact({ contact });

            contactsList.push(contactUI.render());
        });

        return contactsList;
    }

    render() {
        return template({
            groupNameLabel: 'Название',
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
