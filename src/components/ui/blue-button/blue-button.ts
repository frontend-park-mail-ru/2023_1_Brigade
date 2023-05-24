import '@components/ui/blue-button/blue-button.scss';
import template from '@components/ui/blue-button/blue-button.pug';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class blueButtonUI extends Component<Props, State> {
    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    static renderTemplate(args: { className: string; buttonValue: string }) {
        return template(args);
    }
}
