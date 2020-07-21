import {
    TemplateResult,
    LitElement,
    html,
    css,
    customElement,
    CSSResult,
    property,
    PropertyValues,
    query,
} from 'lit-element';

import { NoiseGenerator, NoiseAlgorithm } from './scripts/NoiseGenerator.js';

import './elements/NoiseControls.js';

import './assets/styles/StyleProvider.js';

const defaultNoiseAlgorithms: NoiseAlgorithm[] = [
    {
        id: 0,
        alive: false,
        name: 'Random Noise',
    },
    {
        id: 1,
        alive: false,
        name: 'Simplex Noise',
    },
    {
        id: 2,
        alive: false,
        name: 'Perlin Noise',
    },
    {
        id: 3,
        alive: false,
        name: 'Value Noise',
    },
    {
        id: 4,
        alive: false,
        name: 'Voronoi',
    },
    {
        id: 5,
        alive: true,
        name: 'FBM noise',
    },
];

@customElement('my-app')
export class MyApp extends LitElement {
    public static styles: CSSResult = css`
        :host {
            display: block;
        }

        .noise-wrapper {
            position: relative;
        }

        canvas {
            display: block;
        }
    `;

    @property({ type: String })
    private test: string = '"test"';

    @property({ type: Object })
    private noiseGenerator?: NoiseGenerator;

    @property({ type: Array })
    private noiseAlgorithms: NoiseAlgorithm[] = defaultNoiseAlgorithms;

    @query('.noise-wrapper')
    private readonly noiseWrapper?: HTMLDivElement;

    constructor() {
        super();

        // @ts-ignore
        window.addEventListener('toggle-noise-alive', this.toggleNoiseAlive);
    }

    public readonly render: () => TemplateResult = (): TemplateResult => {
        return html`
            <style-provider>
                <div class="noise-wrapper">
                    <noise-controls
                        .noiseAlgorithms="${this.noiseAlgorithms}"
                    ></noise-controls>
                </div>
            </style-provider>
        `;
    };

    protected readonly updated: (changedProperties: PropertyValues) => void = (
        changedProperties: PropertyValues
    ): void => {
        if (this.noiseWrapper && this.noiseGenerator === undefined) {
            this.noiseGenerator = new NoiseGenerator(
                this.noiseWrapper,
                this.noiseAlgorithms
            );

            if (this.noiseAlgorithms) {
                this.noiseGenerator.noiseAlgorithms = this.noiseAlgorithms;
                this.noiseGenerator.updateUniformFunctions();
            }
        }

        if (
            this.noiseGenerator &&
            changedProperties.has('noiseAlgorithms') &&
            this.noiseGenerator.noiseAlgorithms !== this.noiseAlgorithms
        ) {
            this.noiseGenerator.noiseAlgorithms = this.noiseAlgorithms;
            this.noiseGenerator.updateUniformFunctions();
        }
    };
}
