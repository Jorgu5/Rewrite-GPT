import { matchTextBoxes, isTextInputElement } from './helpers';

class MtfkEvents {
    private processedElements: Set<Element>;

    constructor() {
        this.processedElements = new Set<Element>();
    }

    public attachMtfkButtonListener(mtfkButton: HTMLElement, mtfkShadow: ShadowRoot, mtfkFragment: DocumentFragment, mtfkPopup: HTMLElement): void {
        mtfkButton.addEventListener('click', () => {
            if (mtfkShadow.querySelector('.mtfk__popup')) {
                mtfkShadow.querySelector('.mtfk__popup').remove();
                return;
            }
            mtfkFragment.append(mtfkPopup);
            mtfkShadow.append(mtfkFragment);
        });
    }

    private attachCloseMtfkListener(mtfkClose: HTMLElement, mtfkPopup: HTMLElement): void {
        mtfkClose.addEventListener('click', () => {
            mtfkPopup.remove();
        });
    }

    public getUpdatedTextOnClick(mtfkWrapper: HTMLDivElement, textBox: HTMLTextAreaElement | HTMLInputElement): void {
        const buttons = mtfkWrapper.querySelectorAll('.mtfk__option');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = textBox.value;
                const port = chrome.runtime.connect({ name: 'waitGPT' });
                const tone = button.getAttribute('aria-label');
                port.postMessage({ prompt: value, tone: tone });
                if (value.length > 3) {
                    port.onMessage.addListener(function (response) {
                        textBox.value = response.editedPrompt;
                        port.disconnect();
                    });
                }
            });
        });
    }

    public createMtfkObserver(): MutationObserver {
        return new MutationObserver((mutations) => {
            const matchingElements = matchTextBoxes();
            for (const element of matchingElements) {
                if (!this.processedElements.has(element)) {
                    if (isTextInputElement(element)) {
                        element.addEventListener('focus', () => {
                            const textAreaFocus = new CustomEvent('textAreaFocused', {
                                detail: { focusedElement: element },
                            });
                            document.dispatchEvent(textAreaFocus);
                        });
                        this.processedElements.add(element);
                    }
                }
            }
        });
    }
}
export default MtfkEvents;
