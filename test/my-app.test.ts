import { html, fixture, expect } from '@open-wc/testing';

import { MyApp } from '../src/MyApp.js';

describe('MyApp', () => {
    let element = new MyApp();

    beforeEach(async () => {
        element = await fixture(html`<my-app></my-app>`);
    });

    it('renders a game canvas', () => {
        const canvas = element.shadowRoot!.querySelector('game-canvas')!;
        expect(canvas).to.exist;
    });

    it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
    });
});
