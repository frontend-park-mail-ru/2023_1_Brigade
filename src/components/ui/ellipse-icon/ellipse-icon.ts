import '@components/ui/ellipse-icon/ellipse-icon.scss';
import template from '@components/ui/ellipse-icon/ellipse-icon.pug';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class ellipseIconUI extends Component<Props, State> {
    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    static renderTemplate(args: { imgSrc: string; altMsg: string }) {
        return template(args);
    }
}
