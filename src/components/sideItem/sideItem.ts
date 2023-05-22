import template from '@components/sideItem/sideItem.pug';
import '@components/sideItem/sideItem.scss';
import { Component } from '@framework/component';

interface Props {
    navSvgIcon: string;
    navItemValue: string;
}

interface State {
    isMounted: boolean;
}

export class DumbSideItem extends Component<Props, State> {
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
        console.log('nav svg icon: ', this.props?.navSvgIcon);
        return template({
            SideButton: this.props?.navSvgIcon,
            ItemValue: this.props?.navItemValue,
        });
    }
}
