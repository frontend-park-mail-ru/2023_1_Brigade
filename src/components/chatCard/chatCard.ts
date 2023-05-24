import { Component } from '@framework/component';
import template from '@components/chatCard/chatCard.pug';
import '@components/chatCard/chatCard.scss';
import { smallEllipseIconUI } from '@components/ui/small-ellipse-icon/small-ellipse-icon';

interface Props {
    chat: Chat;
}

interface State {
    isMounted: boolean;
}

export class DumbChatCard extends Component<Props, State> {
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

    render() {
        return template({
            avatar: smallEllipseIconUI.renderTemplate({
                imgSrc: this.props?.chat.avatar as string,
                altMsg: this.props?.chat.title as string,
            }),
            title: this.props?.chat.title,
            lastMessage: this.props?.chat.last_message?.body,
            id: this.props?.chat.id,
        });
    }
}
