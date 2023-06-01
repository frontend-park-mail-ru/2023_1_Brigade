import { Component } from '@framework/component';
import template from '@components/search/search.pug';
import '@components/search/search.scss';
import { svgButtonUI } from '@uikit/icon/button';

interface Props {
    inputClassName: string;
    placeholder: string;
}

interface State {}

export class searchUi extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    destroy() {}

    componentDidMount(): void {
        //TODO
    }

    componentWillUnmount(): void {
        //TODO
    }

    render() {
        return template({
            SearchIcon: svgButtonUI.renderTemplate({
                svgClassName: 'search-icon',
            }),
            InputClassName: this.props.inputClassName,
            PlaceHolder: this.props.placeholder,
        });
    }
}
