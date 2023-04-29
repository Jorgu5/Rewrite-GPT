import {TextBoxAttribute} from "./interfaces/ITextBox";
import {PromptSettings} from "./types/prompts.type";

const doc = document;

/**
 * Creates an HTML element
 * @param tagName
 * @param className
 * @param innerHTML
 */
export function createHTMLElement<T extends HTMLElement>(tagName: string, className: string, innerHTML?: string | HTMLElement | DocumentFragment): T {
    const element = doc.createElement(tagName) as T;
    element.className = className;
    if (innerHTML) {
        if (typeof innerHTML === 'string') {
            element.textContent = innerHTML;
        } else if (typeof innerHTML === 'object') {
            element.appendChild(innerHTML);
        }
    }
    return element;
}

/**
 * Creates an option element
 * @param modifier
 * @param optionText
 * @param attributes
 */
export function createOption<T extends HTMLElement>(modifier: string, optionText: string, attributes: string[] = []): HTMLButtonElement {
    const option = createHTMLElement('button', 'mtfk__option mtfk__option--' + modifier) as HTMLButtonElement;
    option.textContent = optionText;
    if (attributes.length > 0) {
        attributes.forEach((attribute) => {
            const [name, value] = attribute.split('=');
            option.setAttribute(name, value);

        });
    }
    return option;
}

/**
 * Returns an array of text input elements
 */
export function matchTextBoxes(): HTMLElement[] {
    const possibleTextBoxesAttributes: TextBoxAttribute[] = [
        {'contenteditable': 'true'},
        {'role': 'textbox'},
        {'nodeType': 'textarea'},
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

/**
 * Checks if an element is a text input element
 * @param element
 */
export function isTextInputElement(
    element: HTMLElement
): element is HTMLTextAreaElement | HTMLInputElement {
    return element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement;
}

/**
 * Returns a prompt based on the text length
 * @param textLength
 */
export function getTextLengthPrompt(textLength: number | string): string {
    if (typeof textLength === 'number') {
        return `Make this text around ${textLength} words long`;
    }

    switch (textLength) {
        case 'short':
            return 'Make this text short';
        case 'medium':
            return 'Make this text medium length';
        case 'long':
            return 'Make this text long';
        default:
            return 'Keep the text similar length to the original';
    }
}

/**
 * Creates a prompt settings object
 * @param options
 */
export function createPromptSettings(options: Partial<PromptSettings>): PromptSettings {
    return {
        generalPrompt: options.generalPrompt || '',
        language: options.language,
        textLength: options.textLength,
        structure: options.structure,
    };
}

/**
 * Toggles the custom language input field
 * @private
 */
export function toggleInputs(selectInputName: string, toggledInputName: string, selectedInputValue: string, inverted?: boolean): void {
    const inputs = document.querySelectorAll<HTMLInputElement>(
        `input[name="${selectInputName}"], select[name="${selectInputName}"]`
    );
    const toggledElements = document.querySelectorAll<HTMLInputElement>(
        `input[name="${toggledInputName}"], fieldset[name="${toggledInputName}"], select[name="${toggledInputName}"]`
    );

    const hideToggledInputs = () => {
        toggledElements.forEach((element: HTMLInputElement | HTMLFieldSetElement | HTMLSelectElement) => {
            element.parentElement.hidden = true;
        });
    };

    const showToggledInputs = (condition: boolean) => {
        toggledElements.forEach((element: HTMLInputElement | HTMLFieldSetElement | HTMLSelectElement) => {
            if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
                element.parentElement.hidden = !condition;
            } else {
                element.hidden = !condition;
            }
        });
    };

    // Initialize by hiding the toggled inputs
    // hideToggledInputs();

    inputs.forEach((input) => {
        input.addEventListener("change", () => {
            if (input instanceof HTMLSelectElement) {
                showToggledInputs(input.value === selectedInputValue);
            } else if (input instanceof HTMLInputElement) {
                showToggledInputs((inverted ? !input.checked : input.checked) && input.value === selectedInputValue);
            } else {
                hideToggledInputs();
            }
        });
    });
}

/**
 * Extracts domain name from an url
 * @param url
 */
export function extractTldFromUrl(url: string): string {
    const hostname = new URL(url).hostname;
    return hostname.split('.').slice(-2).join('.');
}

/**
 * Toggles the feature checkboxes
 */
export function toggleFeatureCheckboxes() {
    const writerAssistantCheckbox = document.querySelector('input[name="writer-assistant"]') as HTMLInputElement;
    const assistantInfoText = document.querySelector('.mtfk-settings__assistant-info_text') as HTMLSpanElement;
    const otherCheckboxes = document.querySelectorAll('.mtfk-settings__form_fieldset--tones input[type="checkbox"]:not([name="writer-assistant"])') as NodeListOf<HTMLInputElement>;

    function updateCheckboxes(isChecked: boolean) {
        otherCheckboxes.forEach(checkbox => {
            checkbox.disabled = isChecked;
            if (isChecked) {
                checkbox.checked = false;
            }
            assistantInfoText.hidden = !isChecked;
        });
    }


    if (writerAssistantCheckbox) {
        writerAssistantCheckbox.addEventListener('change', () => {
            const isChecked = writerAssistantCheckbox.checked;
            updateCheckboxes(isChecked);

        });

        // Check if the "Writer Assistant" checkbox is checked on page load
        updateCheckboxes(writerAssistantCheckbox.checked);
    }
}