import {TextBoxAttribute} from "./interfaces/ITextBox";

const doc = document;

export function createHTMLElement<T extends HTMLElement>(tagName: string, className: string, innerHTML?: string | HTMLElement | DocumentFragment): T {
    const element = doc.createElement(tagName) as T;
    element.className = className;
    if (innerHTML) {
        if(typeof innerHTML === 'string') {
            element.textContent = innerHTML;
        } else if(typeof innerHTML === 'object') {
            element.appendChild(innerHTML);
        }
    }
    return element;
}

export function createOption<T extends HTMLElement>(modifier: string, optionText: string, ...attributes: string[]): HTMLSpanElement {
    const option = createHTMLElement('span', 'mtfk__option mtfk__option--'+modifier) as HTMLSpanElement;
    option.textContent = optionText;
    attributes.forEach((attribute) => {
        const [name, value] = attribute.split('=');
        option.setAttribute(name, value);

    });
    return option;
}

export function matchTextBoxes(): HTMLElement[] {
    const possibleTextBoxesAttributes: TextBoxAttribute[] = [
        { 'contenteditable': 'true' },
        { 'role': 'textbox' },
        { 'nodeType': 'textarea' },
    ];

    const matchingElements: HTMLElement[] = [];

    for (const attributeObj of possibleTextBoxesAttributes) {
        const [attribute, value] = Object.entries(attributeObj)[0];
        let query: string;

        if (attribute === 'nodeType') {
            query = value as string;
        } else {
            query = `[${attribute}="${value}"]`;
        }

        const foundElements: NodeListOf<HTMLElement> = doc.querySelectorAll(query);
        foundElements.forEach((element) => {
            matchingElements.push(element);
        });
    }

    return matchingElements;
}

export function isTextInputElement(
    element: HTMLElement
): element is HTMLTextAreaElement | HTMLInputElement {
    return element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement;
}