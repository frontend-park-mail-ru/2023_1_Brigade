import template from '@components/ui/icon/button.pug';
import '@components/ui/icon/button.scss';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class svgButtonUI extends Component<Props, State> {
    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    static renderTemplate(args: { svgClassName: string }) {
        return template(args);
    }
}
