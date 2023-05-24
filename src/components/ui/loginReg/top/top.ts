import template from '@components/ui/loginReg/top/top.pug';
import '@components/ui/loginReg/top/top.css';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class loginRegTopUI extends Component<Props, State> {
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
