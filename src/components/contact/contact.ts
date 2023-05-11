import { Component } from '@framework/component';
import template from '@components/contact/contact.pug';
import '@components/contact/contact.scss';
import { smallEllipseIconUI } from '@components/ui/small-ellipse-icon/small-ellipse-icon';

interface Props {
    contact: User;
}

interface State {
    isSubscribed: boolean;
}

export class DumbContact extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
        //TODO
    }

    componentWillUnmount(): void {
        //TODO
    }

    render() {
        return template({
            avatar: smallEllipseIconUI.renderTemplate({
                imgSrc: this.props?.contact.avatar ?? '',
                altMsg: this.props?.contact.nickname ?? '',
            }),
            nickname: this.props?.contact.nickname,
            status: this.props?.contact.status,
            id: this.props?.contact.id,
        });
    }
}
