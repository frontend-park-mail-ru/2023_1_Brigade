import '@components/ui/error-input/error-input.scss';
import template from '@components/ui/error-input/error-input.pug';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class errorInputUI extends Component<Props, State> {
    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    static renderTemplate(args: { className: string; message: string }) {
        return template(args);
    }
}
