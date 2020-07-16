import { html, TemplateResult } from 'lit-element';
import '../src/MyApp.js';

export default {
    title: 'my-app',
};

export const App: () => TemplateResult = (): TemplateResult => html`
    <my-app></my-app>
`;
