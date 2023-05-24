import { Component } from '@/framework/component';
import template from '@components/login/login.pug';
import '@components/login/login.scss';
import { Input } from '@/uikit/input/input';
import { emailErrorTypes, passwordErrorTypes } from '@/config/errors';
import { Button } from '@uikit/button/button';
import { Avatar } from '@/uikit/avatar/avatar';
import { Link } from '@/uikit/link-item/link-item';
import { Form } from '@/uikit/form/form';

interface Props {
    parent?: HTMLElement;
    style?: Record<string, string | number>;
    onClick?: (e?: Event) => void;
}

interface State {
    isMounted: boolean;
    parent?: HTMLElement | undefined;
    avatar: Avatar;
    email: Input;
    password: Input;
    loginButton: Button;
    form: Form;
    link: Link;
}

export class DumbLogin extends Component<Props, State, HTMLElement> {
    constructor(props: Props) {
        super(props);

        if (this.props.parent) {
            this.node = this.render() as HTMLElement; // TODO: async/await
            this.state.isMounted = true;
            this.state.parent = this.props.parent;
            this.componentDidMount();
            this.props.parent.appendChild(this.node);
        }

        this.state.avatar = new Avatar({
            parent: document.querySelector('.login') as HTMLElement,
            className: 'login-reg__top_photo',
            src: './assets/img/sticker.png',
            alt: 'Привет',
            caption: `Добро пожаловать, рад вас видеть!`,
            captionStyle: 'login-reg__top_welcome',
            captionBlockStyle: 'login-reg__top',
        });

        this.state.form = new Form({
            parent: document.querySelector('.login') as HTMLElement,
            className: 'login__form',
        });

        this.state.email = new Input({
            parent: document.querySelector('.login__form') as HTMLElement,
            className: 'input-container',
            placeholder: 'email',
            uniqClassName: 'email',
            errors: emailErrorTypes,
        });

        this.state.password = new Input({
            parent: document.querySelector('.login__form') as HTMLElement,
            className: 'input-container',
            placeholder: 'password',
            uniqClassName: 'password',
            type: 'password',
            errors: passwordErrorTypes,
        });

        this.state.loginButton = new Button({
            parent: document.querySelector('.login__form') as HTMLElement,
            label: 'Войти',
            className: 'login__form__btn',
        });

        this.state.link = new Link({
            parent: document.querySelector('.login') as HTMLElement,
            className: 'login-reg-bottom__question login-ques',
            href: '/login',
            text: `Ещё нет аккаунта? Зарегистрироваться`,
        });
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartSignUp is not mounted');
        }
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
