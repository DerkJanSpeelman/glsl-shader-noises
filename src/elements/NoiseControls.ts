import {
    TemplateResult,
    LitElement,
    html,
    css,
    customElement,
    CSSResult,
    property,
} from 'lit-element';

import { ToggleNoiseAliveEvent } from '../events';

import { NoiseAlgorithm } from '../scripts/NoiseGenerator';

@customElement('noise-controls')
export class NoiseControls extends LitElement {
    public static styles: CSSResult = css`
        :host {
            position: absolute;
            display: block;
            background-color: #1b1b1b;
            color: #eeeeee;
            top: 0;
            right: 0;
        }
    `;

    @property({ type: Array })
    public noiseAlgorithms?: NoiseAlgorithm[];

    public render: () => TemplateResult = (): TemplateResult => html`
        ${this.noiseAlgorithms?.map(
            (noiseAlgorithm: NoiseAlgorithm, index: number): TemplateResult =>
                html`
                    <div
                        @click="${(): void => {
                            this.noiseEnabled(index);
                        }}"
                    >
                        ${noiseAlgorithm.name}: ${noiseAlgorithm.alive}
                    </div>
                `
        )}
    `;

    private readonly noiseEnabled: (index: number) => void = (
        index: number
    ): void => {
        const toggleNoiseAliveEvent: ToggleNoiseAliveEvent = new CustomEvent(
            'toggle-noise-alive',
            {
                bubbles: true,
                composed: true,
                detail: {
                    value: index,
                },
            }
        );

        this.dispatchEvent(toggleNoiseAliveEvent);
        this.toggleTest(toggleNoiseAliveEvent);
    };

    private readonly toggleTest: (e: ToggleNoiseAliveEvent) => void = (
        e: ToggleNoiseAliveEvent
    ): void => {
        const noiseAlgorithms: NoiseAlgorithm[] | undefined = this
            .noiseAlgorithms;

        if (noiseAlgorithms === undefined) {
            return;
        }

        for (let index = 0; index < noiseAlgorithms.length; index++) {
            if (index === e.detail.value) {
                noiseAlgorithms[index].alive = !noiseAlgorithms[index].alive;
            }
        }
        this.noiseAlgorithms = [];
        this.noiseAlgorithms = noiseAlgorithms;
    };
}
