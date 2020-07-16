import {
    TemplateResult,
    LitElement,
    html,
    css,
    customElement,
    CSSResult,
    property,
} from 'lit-element';

import { Canvas } from './scripts/Canvas.js';
import './assets/styles/StyleProvider.js';

@customElement('my-app')
export class MyApp extends LitElement {
    public static styles: CSSResult = css`
        :host {
            display: block;
        }
    `;

    @property({ type: Object })
    private container?: HTMLDivElement;

    protected readonly firstUpdated: () => void = (): void => {
        this.container = document.createElement('div');
        this.container.classList.add('canvas-container');
        new Canvas(this.container);
    };

    public render: () => TemplateResult = (): TemplateResult => {
        return html`
            <style-provider>
                ${this.container}
            </style-provider>
        `;
    };
}
