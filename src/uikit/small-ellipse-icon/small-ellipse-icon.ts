import '@uikit/small-ellipse-icon/small-ellipse-icon.scss';
import template from '@uikit/small-ellipse-icon/small-ellipse-icon.pug';
import { Component } from '@framework/component';

interface Props {}

interface State {}

export class smallEllipseIconUI extends Component<Props, State> {
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
