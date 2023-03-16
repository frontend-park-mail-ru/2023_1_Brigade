import { ROOT } from '@config/config';


export interface Component extends anyObject {
    props: componentProps;
    rootNode: HTMLElement;
}