import '@components/ui/dataInputReadOnly/dataInputReadOnly.scss';
import template from '@components/ui/dataInputReadOnly/dataInputReadOnly.pug';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class dataInputReadOnlyUI extends Component<Props, State> {
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
