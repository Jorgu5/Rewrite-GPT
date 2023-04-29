import {toggleFeatureCheckboxes, toggleInputs} from "../helpers";
import {singletonFactory} from "../singleton";

class Options {
    constructor() {
        toggleInputs('default-language', 'custom-language', 'custom');
        toggleInputs('default-length', 'custom-length', 'custom');
        toggleInputs('default-brand-tone', 'default-tones', 'brand', true);
        toggleFeatureCheckboxes();
        document.querySelectorAll<HTMLInputElement>('input[name*="-shortcut"]').forEach((element: HTMLInputElement) => {
            element.addEventListener('keydown', (event: KeyboardEvent) => {
                this.processKeyStroke(event);
            });
        });
    }

    /**
     * Processes the key stroke and adds it to the input value
     * @param event
     * @private
     */
    private processKeyStroke(event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
        const keyPressed = event.key;

        if (keyPressed === " " || keyPressed === "Enter" || event.repeat) {
            return;
        }

        if (keyPressed === "Backspace") {
            inputElement.value = "";
            event.preventDefault();
            return;
        }

        // Check if there's already a value in the input element
        if (inputElement.value) {
            inputElement.value += " + " + keyPressed;
        } else {
            inputElement.value = keyPressed;
        }
        // Prevent the default behavior of adding the character to the input value
        event.preventDefault();
    }
}

singletonFactory(Options);
