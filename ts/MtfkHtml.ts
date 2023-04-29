import {createHTMLElement} from "./helpers";
import MtfkEvents from "./MtfkEvents";
import MtfkHtmlExtension from "./MtfkHtmlExtensions";
import MtfkGeneralOptions from "./MtfkGeneralOptions";

const document = window.document; // cache the document object

/**
 * MTFK HTML class
 */

class MtfkHtml {
    private mtfkEvents: MtfkEvents;
    private mtfkHtmlExtensions: MtfkHtmlExtension;
    private mtfkGeneralOptions: MtfkGeneralOptions;
    constructor(
        mtfkEvents: MtfkEvents,
        mtfkHtmlExtensions: MtfkHtmlExtension,
        mtfkGeneralOptions: MtfkGeneralOptions
    ) {
        this.mtfkEvents = mtfkEvents;
        this.mtfkHtmlExtensions = mtfkHtmlExtensions;
        this.mtfkGeneralOptions = mtfkGeneralOptions;
    }

    /**
     * Create the MTFK buttons and options
     */
    public createMtfkButton<T extends HTMLElement>(): HTMLElement {
        const mtfkButton = createHTMLElement('div', 'mtfk__button');
        mtfkButton.setAttribute('role', 'button');
        mtfkButton.style.backgroundImage = `url(${chrome.runtime.getURL('images/mtfk-logo.png')})`;
        return mtfkButton;
    }

    /**
     * Create the MTFK controls
     */
    public createMtfkControls(): HTMLDivElement {
        // Controls Wrapper
        const mtfkControls = createHTMLElement('div', 'mtfk__controls');
        // General control buttons
        const acceptButton = createHTMLElement('button', 'mtfk__accept-button', 'Accept');
        const refreshButton = createHTMLElement('button', 'mtfk__refresh-button', 'Refresh');
        const cancelButton = createHTMLElement('button', 'mtfk__cancel-button', 'Cancel');
        const arrows = createHTMLElement('div', 'mtfk__arrows');
        // Switch prompts controls
        const arrowLeft = createHTMLElement('div', 'mtfk__arrow-left');
        const arrowRight = createHTMLElement('div', 'mtfk__arrow-right');

        arrows.append(arrowLeft, arrowRight);
        // append all buttons to the controls
        mtfkControls.append(acceptButton, refreshButton, cancelButton, arrows);

        return <HTMLDivElement>mtfkControls;
    }

    public createMtfkPopup(): HTMLDivElement {
        const closeIconChar = String.fromCharCode(10005);
        const mtfkPopup = createHTMLElement('div', 'mtfk__popup');
        const closeIcon = createHTMLElement('div', 'mtfk__popup_close-icon', closeIconChar);
        mtfkPopup.append(closeIcon);
        closeIcon.addEventListener('click', () => {
            mtfkPopup.remove();
        });
        return <HTMLDivElement>mtfkPopup;
    }

    public createMtfkPopupInner(): HTMLDivElement {
        const mtfkPopupInner = createHTMLElement('div', 'mtfk__popup-inner');
        return <HTMLDivElement>mtfkPopupInner;
    }

    public createMtfkPopupTextArea(): HTMLTextAreaElement {
        const mtfkPopupTextArea = createHTMLElement('textarea', 'mtfk__popup-textarea');
        mtfkPopupTextArea.setAttribute('placeholder', '');
        mtfkPopupTextArea.setAttribute('rows', '5');
        return <HTMLTextAreaElement>mtfkPopupTextArea;
    }

    /**
     * Create the shadow DOM for the MTFK extension
     * @param textArea
     */
    public createMtfk(textArea: HTMLTextAreaElement | HTMLInputElement): ShadowRoot {
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
     * Create the base MTFK extension fragment
     */
    public initBaseMtfk(mtfkShadow: ShadowRoot): DocumentFragment {
        const mtfkFragment = document.createDocumentFragment();
        const mtfkPopup = this.generalOptions();
        const mtfkButton = this.createMtfkButton();
        this.mtfkEvents.attachMtfkButtonListener(mtfkButton, mtfkShadow, mtfkFragment, mtfkPopup);
        mtfkFragment.append(mtfkButton);
        return mtfkFragment;
    }

    /**
     * Create the General options for the MTFK extension
     */
    public generalOptions(): HTMLDivElement {
        const mtfkPopup = this.createMtfkPopup();
        const mtfkOptions = this.mtfkGeneralOptions.createMtfkGeneralOptions();
        mtfkPopup.append(mtfkOptions);
        console.log('popup done');
        return mtfkPopup;
    }


    /**
     * Create the MTFK extension fragment
     * @param baseMtfk
     */
    public advancedOptions(baseMtfk: HTMLDivElement) {
        const mtfkPopupInner = this.createMtfkPopupInner();
        const mtfkPopupTextArea = this.createMtfkPopupTextArea();
        const mtfkControls = this.createMtfkControls();
        mtfkPopupInner.append(mtfkPopupTextArea, mtfkControls);
        baseMtfk.append(mtfkPopupInner);
    }

    /**
     * Start the MTFK extension
     * @param textArea
     */
    public mtfkStart(textArea: HTMLTextAreaElement | HTMLInputElement) {
        if (textArea.parentElement.querySelector('.mtfk__shadow-host')) {
            return;
        }
        const mtfk = this.createMtfk(textArea);
        mtfk.appendChild(this.initBaseMtfk(mtfk));
    }
}

export default MtfkHtml;
