export interface IComponent {
    destroy(): void;
}

/**
 * Базовый класс компонента React.
 * @abstract
 * @implements {IComponent}
 * @template Props, State
 */
export abstract class Component<Props, State, Element = HTMLElement>
    implements IComponent
{
    /**
     * Cохраняет переданные параметры props.
     * @param {Object} props - необходимые для работы класса свойства
     * @default {Element} rootNode - div, через который происходит взаимодействие с html.
     */
    constructor(props: Props) {
        this.props = props;
        this.state = {} as State;
    }

    abstract destroy(): void;

    protected props: Props;
    protected state: State;
    protected node: Element | undefined;
    protected unsubscribe: () => void = () => {};
}
