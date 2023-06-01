import template from '@uikit/chatAvatar/chatAvatar.pug';
import '@uikit/chatAvatar/chatAvatar.scss';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class chatAvatarUi extends Component<Props, State> {
    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    static renderTemplate(args: {
        ClassName: string;
        PathToUserImage: string;
        UserName: string;
        UserStatus: string;
        Description?: string;
        Online?: boolean;
    }) {
        return template(args);
    }
}
