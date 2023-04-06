import { Component } from "@/components/component";
import template from "@components/emptyDynamicPage/emptyDynamicPage.pug";
import "@components/emptyDynamicPage/emptyDynamicPage.scss"

export class DumbEmptyDynamicPage extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return template({
            helloMsg: "Выберите чат",
        });
    }
}