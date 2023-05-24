import template from '@components/ui/avatar/avatar.pug';
import '@components/ui/avatar/avatar.scss';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class avatarUi extends Component<Props, State> {
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
        Online: boolean;
    }) {
        return template(args);
    }
}
