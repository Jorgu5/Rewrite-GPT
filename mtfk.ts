import mtfkHTML from "./ts/MtfkHtml";
import MtfkEvents from "./ts/MtfkEvents";
import MtfkHtmlExtension from "./ts/MtfkHtmlExtensions";
import MtfkGeneralOptions from "./ts/MtfkGeneralOptions";

const mtfkEvents = new MtfkEvents();
const mtfkHtmlExtensions = new MtfkHtmlExtension();
const mtfkGeneralOptions = new MtfkGeneralOptions();

const html = new mtfkHTML(
    mtfkEvents, mtfkHtmlExtensions, mtfkGeneralOptions
)

const mtfkObserver = mtfkEvents.createMtfkObserver();

mtfkObserver.observe(document, {
    childList: true,
    subtree: true,
});

console.log('Observer created')
document.addEventListener('textAreaFocused', (event: CustomEvent) => {
    const focusedTextArea = event.detail.focusedElement;
    console.log('Received focused element:', focusedTextArea);
    html.mtfkStart(focusedTextArea);
    console.log('MTFK started');
});
