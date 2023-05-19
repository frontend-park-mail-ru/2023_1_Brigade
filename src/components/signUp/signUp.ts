import { Component } from '@/framework/component';
import template from '@components/signUp/signUp.pug';
import '@components/signUp/signUp.scss';
import { Input } from '@/uikit/input/input';
import {
    emailErrorTypes,
    passwordErrorTypes,
    confirmPasswordErrorTypes,
    nicknameErrorTypes,
} from '@/config/errors';
import { Button } from '@uikit/button/button';
import { Avatar } from '@/uikit/avatar/avatar';
import { Link } from '@/uikit/link-item/link-item';
import { Form } from '@/uikit/form/form';

interface Props {
    parent: HTMLElement;
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
}

interface State {
    isSubscribed: boolean;
    parent?: HTMLElement | undefined;
    avatar: Avatar;
    email: Input;
    nickname: Input;
    password: Input;
    confirmPassword: Input;
    signupButton: Button;
    form: Form;
    link: Link;
}

export class DumbSignUp extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);

        if (this.props.parent) {
            this.node = this.render() as HTMLElement;
            this.state.isSubscribed = true;
            this.state.parent = this.props.parent;
            this.componentDidMount();
            if (this.node) {
                this.props.parent.appendChild(this.node);
            }
        }

        this.state.avatar = new Avatar({
            parent: document.querySelector('.reg') as HTMLElement,
            className: 'login-reg__top_photo',
            src: './assets/img/sticker.png',
            alt: 'Привет',
            caption: `Добро пожаловать, давай начнём!`,
            captionStyle: 'login-reg__top_welcome',
            captionBlockStyle: 'login-reg__top',
        });

        this.state.form = new Form({
            parent: document.querySelector('.reg') as HTMLElement,
            className: 'reg__form',
        });

        this.state.email = new Input({
            parent: document.querySelector('.reg__form') as HTMLElement,
            className: 'input-container',
            placeholder: 'email',
            uniqClassName: 'email',
            errors: emailErrorTypes,
        });

        this.state.nickname = new Input({
            parent: document.querySelector('.reg__form') as HTMLElement,
            className: 'input-container',
            placeholder: 'nickname',
            uniqClassName: 'nickname',
            errors: nicknameErrorTypes,
        });

        this.state.password = new Input({
            parent: document.querySelector('.reg__form') as HTMLElement,
            className: 'input-container',
            placeholder: 'password',
            uniqClassName: 'password',
            type: 'password',
            errors: passwordErrorTypes,
        });

        this.state.confirmPassword = new Input({
            parent: document.querySelector('.reg__form') as HTMLElement,
            className: 'input-container',
            placeholder: 'confirm password',
            uniqClassName: 'confirm-password',
            type: 'password',
            errors: confirmPasswordErrorTypes,
        });

        this.state.signupButton = new Button({
            parent: document.querySelector('.reg__form') as HTMLElement,
            label: 'Войти',
            className: 'reg__form__btn',
        });

        this.state.link = new Link({
            parent: document.querySelector('.reg') as HTMLElement,
            className: 'login-reg-bottom__question reg-ques',
            href: '/login',
            text: `Уже есть аккаунт? Войти`,
        });
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }

        if (this.props.onClick) {
            this.node.addEventListener('click', this.props.onClick);
        }
    }

    componentWillUnmount() {
        if (!this.node) {
            return;
        }

        if (this.props.onClick) {
            this.node.removeEventListener('click', this.props.onClick);
        }
    }

    private render() {
        return new DOMParser().parseFromString(template({}), 'text/html').body
            .firstChild;
    }
}
