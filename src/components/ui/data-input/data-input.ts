import '@components/ui/data-input/data-input.scss';
import template from '@components/ui/data-input/data-input.pug';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class dataInputUI extends Component<Props, State> {
    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    static renderTemplate(args: {
        className: string;
        inputType: string;
        inputPlaceholder: string;
        value: string;
    }) {
        return template(args);
    }
}
