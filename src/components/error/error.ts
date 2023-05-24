import template from '@components/error/error.pug';
import { Component } from '@framework/component';

interface Props {
    contacts?: User[];
}

interface State {
    isMounted: boolean;
}

export class DumbContact extends Component<Props, State> {
    constructor(props: Record<string, unknown>) {
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
        return template({});
    }
}
