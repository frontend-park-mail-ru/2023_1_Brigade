import { Component } from '@framework/component';
import template from '@components/channelInput/channelInput.pug';
import '@components/channelInput/channelInput.scss';

interface Props {
    inputCaption: string;
    inputPlaceholder: string;
}

interface State {}

export class ChannelInput extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    render() {
        return template({
            Caption: this.props.inputCaption,
            Placeholder: this.props.inputPlaceholder,
        });
    }
}
