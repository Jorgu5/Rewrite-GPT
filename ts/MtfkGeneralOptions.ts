import {createHTMLElement, createOption} from "./helpers";
import { gptPrompts } from "./prompts/prompts";

class MtfkGeneralOptions {
    /**
     * Create the base options for the MTFK extension
     */
    public createMtfkGeneralOptions<T extends HTMLElement>(): HTMLDivElement {
        const generalOptionsFragment = document.createDocumentFragment();

        Object.entries(gptPrompts.general_prompts).forEach(([key, prompt]) => {
            // concatenate string with '-' to make it a valid id for prompt.name
            const optionName = prompt.name.toLowerCase();
            const modifierClass = optionName.replace(/ /g, '-');
            const generalOption = createOption(modifierClass, optionName);
            generalOptionsFragment.appendChild(generalOption);
        });

        const mtfkOptions = createHTMLElement('div', 'mtfk__options', generalOptionsFragment);
        return <HTMLDivElement>mtfkOptions;
    }
}

export default MtfkGeneralOptions;