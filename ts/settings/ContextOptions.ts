// AdvancedOptions.ts
import {extractTldFromUrl, toggleFeatureCheckboxes, toggleInputs} from '../helpers';
import {singletonFactory} from '../singleton';

class ContextOptions {
    constructor() {
        toggleInputs('disable-mtfk', 'context', 'context', true);
        toggleInputs('global-mtfk', 'context-settings', 'context');
        toggleInputs('default-length', 'custom-length', 'custom');
        toggleInputs('default-brand-tone', 'default-tones', 'brand', true);
        toggleFeatureCheckboxes();
        this.redirectToGeneralSettings();
        this.insertSiteContextName();
    }

    /**
     * Redirects the user to the general settings page
     * @private
     */
    private redirectToGeneralSettings(): void {
        document.querySelectorAll('.advanced-options').forEach((element: HTMLAnchorElement) => {
            element.addEventListener('click', (event: MouseEvent) => {
                event.preventDefault();
                if (chrome.runtime.openOptionsPage) {
                    chrome.runtime.openOptionsPage();
                } else {
                    window.open(chrome.runtime.getURL('settings.html'));
                }
            });
        });
    }

    /**
     * Inserts the current site context name into the settings page
     * @private
     */
    private insertSiteContextName(): void {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: chrome.tabs.Tab[]) => {
            const currentUrl = tabs[0].url;
            const currentTld = extractTldFromUrl(currentUrl);
            console.log(currentUrl);
            const currentUrlElements = document.querySelectorAll('.mtfk-settings__current-context');
            currentUrlElements.forEach((element: HTMLSpanElement) => {
                element.innerHTML = currentTld;
            });
        });
    }
}

singletonFactory(ContextOptions);
