import '@components/ui/white-button/white-button.scss';
import template from '@components/ui/white-button/white-button.pug';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class whiteButtonUI extends Component<Props, State> {
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
