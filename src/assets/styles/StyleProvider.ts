import { css, CSSResult, customElement, html, LitElement } from 'lit-element';
import { TemplateResult } from 'lit-html';

@customElement('style-provider')
export class StyleProvider extends LitElement {
    public static styles: CSSResult = css`
        :host {
            display: block;
        }
    `;

    private readonly globalCSS: CSSResult = css`
        html,
        body {
            min-height: 100%;
            overflow: hidden;
        }
        html {
            font-size: 16px;
        }

        body {
            line-height: 1.2;
            text-rendering: geometricPrecision;
            -webkit-font-smoothing: antialiased;
            -webkit-tap-highlight-color: transparent;
            -webkit-text-size-adjust: 100%;
            margin: 0;
            height: 100%;
        }
    `;

    public constructor() {
        super();

        this.setGlobalCSS(this.globalCSS);
    }

    /**
     * Render function
     */
    public render: () => TemplateResult = (): TemplateResult =>
        html`<slot></slot>`;

    private readonly setGlobalCSS: (cssResult: CSSResult) => void = (
        cssResult: CSSResult
    ): void => {
        if (document.body.classList.contains('__styleProviderEnabled__')) {
            return;
        }

        const head: HTMLHeadElement | null =
            document.head || document.querySelectorAll('head')[0];
        const style: HTMLStyleElement = document.createElement('style');

        style.type = 'text/css';

        style.append(document.createTextNode(cssResult.toString()));

        head.append(style);

        document.body.classList.add('__styleProviderEnabled__');
    };
}
