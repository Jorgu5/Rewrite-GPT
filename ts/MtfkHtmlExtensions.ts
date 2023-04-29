import mtfkStyles from 'bundle-text:../mtfk.scss';

class MtfkHtmlExtensions extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
                    <style>${mtfkStyles}</style>
                `;
    }
}
// Define the custom element outside the MtfkHTML class
customElements.define('mtfk-extension', MtfkHtmlExtensions);
export default MtfkHtmlExtensions;