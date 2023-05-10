import { Component } from '@/components/component';
import { store } from '@/store/store';
import template from '@components/contact-item/contact-item.pug';
import '@components/contact-item/contact-item.scss';
import { smallEllipseIconUI } from '@components/ui/small-ellipse-icon/small-ellipse-icon';

export class ContactItem extends Component {
    constructor(props: any) {
        super(props);

        this.state = {
            parent: this.props.parent,
            node: undefined,
            isSubscribed: false,
            onClick: this.props.onClick,
            contactId: this.props.contact.id,
            observe: this.props.observe,
        };

        this.unsubscribe = () => {};
    }

    componentDidMount() {
        if (!this.state.isSubscribed) {
            this.state.node = this.render();
            this.state.node.addEventListener('click', (e: Event) => {
                this.state.onClick(e);
            });

            this.unsubscribe = store.subscribe(
                this.constructor.name + `:${this.state.contactId}`,
                (props: anyObject) => {
                    let prop = props;
                    this.state.observe.forEach((item: string) => {
                        prop = prop[item];
                    });
                    const index = prop.findIndex((contact: { id: number }) => {
                        return contact.id === this.state.contactId;
                    });

                    if (this.props.contact != prop[index]) {
                        this.props.contact = prop[index];

                        this.update();
                    }
                }
            );

            this.state.parent.appendChild(this.state.node);
            this.state.isSubscribed = true;
        }
    }

    componentWillUnmount() {
        if (this.state.isSubscribed) {
            this.unsubscribe();
            this.state.node.remove();
            this.state.isSubscribed = false;
        }
    }

    update() {
        const updatedNode = this.render();
        this.state.node.replaceWith(updatedNode);
        this.state.node = updatedNode;
    }

    render() {
        return new DOMParser().parseFromString(
            template({
                avatar: smallEllipseIconUI.renderTemplate({
                    imgSrc: this.props.contact.avatar,
                    altMsg: this.props.contact.nickname,
                }),
                nickname: this.props.contact.nickname,
                status: this.props.contact.status,
                id: this.props.contact.id,
            }),
            'text/html'
        ).body.firstChild;
    }
}