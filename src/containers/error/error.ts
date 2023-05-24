import { Component } from '@framework/component';

interface Props {}

interface State {
    isMounted: boolean;
    domElements: {
        backButton: HTMLInputElement | null;
    };
}

/**
 * Отрисовывает логин.
 * Прокидывает actions в стору для логина
 * Также подписывается на изменения статуса логина,
 * для корректного рендера ошибки
 *
 */
export class SmartError extends Component<Props, State> {
    /**
     * Cохраняет props
     * @param {Object} props - параметры компонента
     */
    constructor(props: Record<string, unknown>) {
        super(props);

        this.state = {
            isMounted: false,
            domElements: {
                backButton: null,
            },
        };

        this.componentDidMount();
    }

    destroy() {
        if (this.state.isMounted) {
            this.componentWillUnmount();
        } else {
            console.error('SmartError is not mounted');
        }
    }

    /**
     * Рендерит ошибку
     */
    render() {
        if (this.state.isMounted) {
        }
    }

    /**
     * Навешивает переданные обработчики на валидацию и кнопки
     */
    componentDidMount() {
        if (!this.state.isMounted) {
            // this.unsubscribe.push(store.subscribe(this.constructor.name, (props: Record<string, unknown>) => {
            //     this.props = props;

            //     this.render();
            // }));
            if (this.state.isMounted === false) {
                this.state.isMounted = true;
            }
        }
    }

    /**
     * Удаляет все подписки
     */
    componentWillUnmount() {
        if (this.state.isMounted) {
            this.unsubscribe();
            this.state.isMounted = false;
        }
    }
}
