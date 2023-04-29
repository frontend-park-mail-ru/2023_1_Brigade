import { Component } from '@/framework/component';
import template from '@components/ui/input/input.pug';

export class inputUi extends Component {
    constructor(props: AnyObject) {
        super(props);
    }

    render() {
        return template({
            InputClassName: this.props.inputClassName,
            // UserImage: this.props.userImage,
            SendBtn: this.props.sendBtn,
            PlaceHolder: this.props.placeholder,
        });
    }
}
