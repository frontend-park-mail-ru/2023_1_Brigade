import template from '@components/channelCreation/channel.pug';
import '@components/channelCreation/channel.scss';
import { Component } from '@framework/component';
import { ChannelInput } from '@components/channelInput/channelInput';
import { ellipseIconUI } from '@components/ui/ellipse-icon/ellipse-icon';

interface Props {}

interface State {}

export class DumbCreateChannel extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    destroy() {}

    componentDidMount(): void {
        //
    }

    componentWillUnmount(): void {
        //
    }

    render() {
        return template({
            NameInput: new ChannelInput({
                inputCaption: 'Название',
                inputPlaceholder: 'Введите название канала',
            }).render(),
            DescrInput: new ChannelInput({
                inputCaption: 'Описание',
                inputPlaceholder: 'Введите описание канала',
            }).render(),
            ChannelAvatar: ellipseIconUI.renderTemplate({
                imgSrc: './assets/img/logo.png',
                altMsg: 'Channel avatar',
            }),
        });
    }
}
