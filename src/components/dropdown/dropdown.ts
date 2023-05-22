import { Component } from '@framework/component';
import template from '@components/dropdown/dropdown.pug';
import '@components/dropdown/dropdown.scss';
import { svgButtonUI } from '@/components/ui/icon/button';

interface Props {
    icon: string;
    list: Record<string, string>[];
    id?: string;
}

interface State {}

export class Dropdown extends Component<Props, State> {
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
            icon: svgButtonUI.renderTemplate({ svgClassName: this.props.icon }),
            list: this.props.list,
            id: this.props.id ?? '',
        });
    }
}
