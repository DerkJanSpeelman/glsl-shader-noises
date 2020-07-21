import {
    TemplateResult,
    LitElement,
    html,
    css,
    customElement,
    CSSResult,
    property,
} from 'lit-element';

import { NoiseAlgorithm } from '../scripts/NoiseGenerator';

@customElement('noise-controller')
export class NoiseController extends LitElement {
    public static styles: CSSResult = css`
        :host {
            display: block;
            padding: 8px;
            min-width: 200px;
        }
    `;

    @property({ type: Object })
    public noise?: NoiseAlgorithm;

    public render: () => TemplateResult = (): TemplateResult =>
        html`${this.noise
            ? html`
                  ${this.noise.alive} <input type="checkbox"
                  ?checked="${this.noise.alive}" @click="${this.toggleAlive}"}"
                  /> ${this.noise.name}
              `
            : ''} `;

    private readonly toggleAlive: (e: MouseEvent) => void = (
        e: MouseEvent
    ): void => {
        if (!this.noise || (this.noise && this.noise.alive)) {
            e.preventDefault();
            return;
        }

        this.noise.alive = true;
        console.log(this.noise);

        const toggleNoiseAliveEvent: CustomEvent = new CustomEvent(
            'toggle-noise-alive',
            <CustomEvent>(<unknown>{
                bubbles: true,
                composed: true,
                detail: {
                    value: this.noise.id,
                },
            })
        );

        this.dispatchEvent(toggleNoiseAliveEvent);
    };
}
