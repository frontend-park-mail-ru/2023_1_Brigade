import template from '@components/button-list/button-list.pug';
import { Component } from '@framework/component';

interface Props {
    listClassName: string;
    btnClassName: string;
    buttons: string[];
}

interface State {}

export class ButtonList extends Component<Props, State> {
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
            ListClassName: this.props.listClassName,
            ButtonClassName: this.props.btnClassName,
            Buttons: this.props.buttons,
        });
    }
}
