import { matchTextBoxes, isTextInputElement } from './helpers';
import {createMtfk, appendMtfkElements, mtfkStart } from './html';
export function appendCloseButton(mtfkOptions: HTMLDivElement): void {
    const closeButton = document.createElement('div');
    closeButton.className = 'mtfk__options_close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        mtfkOptions.style.display = 'none';
    });
    mtfkOptions.prepend(closeButton);
}

export function toggleMtfkOptions(mtfkOptions: HTMLDivElement): void {
    mtfkOptions.style.display = mtfkOptions.style.display === 'none' ? 'block' : 'none';
}

export function getUpdatedTextOnClick(mtfkWrapper: HTMLDivElement, textBox: HTMLTextAreaElement | HTMLInputElement): void {
    const buttons = mtfkWrapper.querySelectorAll('.mtfk__option');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = textBox.value;
            const port = chrome.runtime.connect({ name: 'waitGPT' });
            const tone = button.getAttribute('aria-label');
            port.postMessage({ prompt: value, tone: tone });
            if(value.length > 3) {
                port.onMessage.addListener(function(response) {
                    textBox.value = response.editedPrompt;
                    port.disconnect();
                });
            }
        });
    });
}

export function createMtfkObserver(): MutationObserver {
    const processedElements = new Set<Element>();

    return new MutationObserver((mutations) => {
        const matchingElements = matchTextBoxes();
        for (const element of matchingElements) {
            if (!processedElements.has(element)) {
                console.log('New matching element found:', element);
                if (isTextInputElement(element)) {
                    element.addEventListener('focus', () => {
                        mtfkStart(element);
                    });
                    processedElements.add(element);
                }
            }
        }
    });
}

export function addMtfkEvents(mtfkOptions, mtfkButton, mtfkShadow): void {
    appendCloseButton(mtfkOptions);
    mtfkButton.addEventListener('click', () => {
        toggleMtfkOptions(mtfkOptions);
    });
    getUpdatedTextOnClick(mtfkShadow, <HTMLInputElement | HTMLTextAreaElement>mtfkShadow.host);
}
