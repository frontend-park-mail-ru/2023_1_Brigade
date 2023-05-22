import template from '@components/ui/loginReg/bottom/bottom.pug';
import '@components/ui/loginReg/bottom/bottom.css';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class loginRegBottomUI extends Component<Props, State> {
    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    static renderTemplate(args: Record<string, unknown>) {
        return template(args);
    }
}
