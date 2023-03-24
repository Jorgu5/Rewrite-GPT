import {appendCloseButton, toggleMtfkOptions, getUpdatedTextOnClick, addMtfkEvents} from './events';
import {createHTMLElement, createOption} from "./helpers";
import mtfkStyles from 'bundle-text:../mtfk.scss';

const document = window.document;

/**
 * Create MTFK shadow host.
 */
class MtfkExtension extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>${mtfkStyles}</style>
            <p>Hello, Shadow DOM!</p>
        `;
    }
}

customElements.define('mtfk-extension', MtfkExtension);

/**
 * Create MTFK button.
 */

function createMtfkButton<T extends HTMLElement>(): HTMLElement {
    const mtfkButton = createHTMLElement('div', 'mtfk__button');
    mtfkButton.setAttribute('role', 'button');
    mtfkButton.style.backgroundImage = `url(${chrome.runtime.getURL('images/mtfk-logo.png')})`;
    return mtfkButton;
}

/**
 * Create MTFK options.
 */
function createBaseMtfkOptions<T extends HTMLElement>(): HTMLDivElement {
    const optionsFragment = document.createDocumentFragment();
    const baseOptions = ['Formal', 'Casual', 'Friendly'];

    baseOptions.forEach((option) => {
        const optionElement = createOption(option.toLowerCase(), 'Make it more ' + option.toLowerCase(), 'aria-label=' + option, 'role=button');
        optionsFragment.appendChild(optionElement);

    });

    const mtfkOptions = createHTMLElement('div', 'mtfk__options', optionsFragment);
    mtfkOptions.style.display = 'none';
    return <HTMLDivElement>mtfkOptions;
}

/**
 * Create MTFK shadow DOM.
 * @param textArea
 */

export function createMtfk(textArea: HTMLTextAreaElement | HTMLInputElement): ShadowRoot {
    if (!textArea) {
        console.error('Textbox element is not provided.');
        return null;
    }

    const textAreaWrapper = textArea.parentElement ? textArea.parentElement : textArea.closest('div');
    if (!textAreaWrapper) {
        console.error('No parent div element found for the textbox.');
        return null;
    }
    const shadowHost = createHTMLElement('mtfk-extension', 'mtfk__shadow-host');
    textAreaWrapper.appendChild(shadowHost);

    return shadowHost.shadowRoot;
}


/**
 * Append elements to shadow DOM.
 * @param mtfkShadow
 */

export function appendMtfkElements(mtfkShadow: ShadowRoot): void {
    const mtfkButton = createMtfkButton();
    const mtfkOptions = createBaseMtfkOptions();
    mtfkShadow.appendChild(mtfkButton);
    mtfkShadow.appendChild(mtfkOptions);
    addMtfkEvents(mtfkOptions, mtfkButton, mtfkShadow);
}

/**
 * Start MTFK extension.
 * @param textArea
 */
export function mtfkStart(textArea: HTMLTextAreaElement | HTMLInputElement): void {
    if (textArea.parentElement.querySelector('.mtfk__shadow-host')) {
        return;
    }
    const mtfk = createMtfk(textArea);
    appendMtfkElements(mtfk);
}