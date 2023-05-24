import '@components/ui/header-input/header-input.scss';
import template from '@components/ui/header-input/header-input.pug';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class headerInputUI extends Component<Props, State> {
    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    static renderTemplate(args: { headerInputText: string }) {
        return template(args);
    }
}
