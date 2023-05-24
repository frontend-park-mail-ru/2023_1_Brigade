import { Component } from '@framework/component';
import template from '@components/profile/profile.pug';
import { blueButtonUI } from '@components/ui/blue-button/blue-button';
import { dataInputUI } from '@components/ui/data-input/data-input';
import { headerInputUI } from '@components/ui/header-input/header-input';
import { errorInputUI } from '@components/ui/error-input/error-input';
import {
    nicknameErrorTypes,
    passwordErrorTypes,
    usernameErrorTypes,
    newPasswordErrorTypes,
} from '@config/errors';
import '@components/profile/profile.scss';
import { chatAvatarUi } from '@components/ui/chatAvatar/chatAvatar';

interface Props {
    user: User;
}

interface State {
    isMounted: boolean;
}

export class DumbProfile extends Component<Props, State> {
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

    getValidateErrors(
        errors: { param: string; class: string; message: string }[]
    ) {
        let result = {};

        errors.forEach((err) => {
            result = {
                ...result,
                [err.param]: errorInputUI.renderTemplate({
                    className: `${err.class}`,
                    message: `${err.message}`,
                }),
            };
        });

        return result;
    }

    getUsername() {
        if (parseInt(this.props.user.username) == this.props.user.id) {
            return '@';
        }

        return '@' + this.props?.user.username;
    }

    render() {
        return template({
            avatar: chatAvatarUi.renderTemplate({
                ClassName: 'profile__avatar',
                PathToUserImage: this.props?.user.avatar ?? '',
                UserName: '',
                UserStatus: '',
                Online: false,
            }),

            nickname: this.props?.user.nickname,
            username: this.getUsername(),
            status: this.props?.user.status,

            nicknameHeader: headerInputUI.renderTemplate({
                headerInputText: 'Никнейм',
            }),
            nicknameInput: dataInputUI.renderTemplate({
                className: 'nickname',
                inputType: 'text',
                inputPlaceholder: '',
                value: this.props?.user.nickname ?? '',
            }),
            ...this.getValidateErrors(nicknameErrorTypes),

            usernameHeader: headerInputUI.renderTemplate({
                headerInputText: 'Имя пользователя',
            }),
            usernameInput: dataInputUI.renderTemplate({
                className: 'username',
                inputType: 'text',
                inputPlaceholder: '',
                value: this.getUsername(),
            }),
            ...this.getValidateErrors(usernameErrorTypes),

            statusHeader: headerInputUI.renderTemplate({
                headerInputText: 'Статус',
            }),
            statusInput: dataInputUI.renderTemplate({
                className: 'status',
                inputType: 'text',
                inputPlaceholder: '',
                value: this.props?.user.status ?? '',
            }),

            currentPasswordHeader: headerInputUI.renderTemplate({
                headerInputText: 'Текущий пароль',
            }),
            currentPasswordInput: dataInputUI.renderTemplate({
                className: 'current-password',
                inputType: 'password',
                inputPlaceholder: '**********',
                value: '',
            }),
            ...this.getValidateErrors(passwordErrorTypes),

            newPasswordHeader: headerInputUI.renderTemplate({
                headerInputText: 'Новый пароль',
            }),
            newPasswordInput: dataInputUI.renderTemplate({
                className: 'new-password',
                inputType: 'password',
                inputPlaceholder: '**********',
                value: '',
            }),
            ...this.getValidateErrors(newPasswordErrorTypes),

            buttonSave: blueButtonUI.renderTemplate({
                className: 'button-save',
                buttonValue: 'Сохранить изменения',
            }),
        });
    }
}
