import template from '@components/ui/loginReg/input/input.pug';
import '@components/ui/loginReg/input/input.css';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class loginRegInputUI extends Component<Props, State> {
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
