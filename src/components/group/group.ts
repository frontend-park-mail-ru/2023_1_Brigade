import { Component } from '@framework/component';
import template from '@components/group/group.pug';
import { DumbContact } from '@components/contact/contact';
import '@components/group/group.scss';
import '@components/createGroup/createGroup.scss';
import { dataInputUI } from '@components/ui/data-input/data-input';
import { blueButtonUI } from '@components/ui/blue-button/blue-button';

interface Props {
    groupName?: string;
    contactList?: User[];
}

interface State {
    isMounted: boolean;
}

export class DumbAddContactInGroup extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    destroy() {}

    getContactList() {
        const contacts: string[] = [];
        this.props?.contactList?.forEach((contact) => {
            contacts.push(new DumbContact({ contact }).render());
        });

        return contacts;
    }

    componentDidMount(): void {
        //TODO
    }

    componentWillUnmount(): void {
        //TODO
    }

    render() {
        return template({
            GroupName: 'Название',
            GroupNameInput: dataInputUI.renderTemplate({
                className: 'groupName',
                inputType: 'text',
                inputPlaceholder: 'новое имя группы',
                value: '',
            }),
            CreateGroupButton: blueButtonUI.renderTemplate({
                className: 'button-submit',
                buttonValue: 'Сохранить изменения',
            }),
            Contacts: this.getContactList(),
            GroupMembersHeader: 'Контакты',
        });
    }
}
