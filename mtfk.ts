import {createMtfkObserver} from "./ts/events";

const mtfkObserver = createMtfkObserver();
// Start observing the entire document for changes
mtfkObserver.observe(document, { childList: true, subtree: true });