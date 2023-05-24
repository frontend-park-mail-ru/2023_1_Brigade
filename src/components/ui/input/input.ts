import template from '@components/ui/input/input.pug';
import '@components/ui/input/input.scss';
import { Component } from '@framework/component';

interface Props {
    inputClassName: string;
    sendBtn: string;
    placeholder: string;
}

interface State {}

export class inputUI extends Component<Props, State> {
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
            InputClassName: this.props?.inputClassName,
            SendBtn: this.props?.sendBtn,
            PlaceHolder: this.props?.placeholder,
        });
    }
}
