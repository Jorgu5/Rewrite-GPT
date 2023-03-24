import { setLocalStorage} from "./ts/storage";
import { getCompletion } from "./ts/gpt";

const url: string = 'https://api.openai.com/v1/chat/completions';
let port: chrome.runtime.Port | null = null;

console.log('background working');

setLocalStorage();
// Listen for messages from the content script
chrome.runtime.onConnect.addListener(function(listenerPort) {
    if (listenerPort.name === 'waitGPT') {
        port = listenerPort;
        port.onMessage.addListener(function(message) {
            chrome.storage.local.get('apiKey', (result) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    getCompletion(message.prompt, message.tone, result.apiKey, url).then(response => {
                        if (response) {
                            const textCompletion = response['choices'][0]['message']['content'];
                            // const finishReason = result.finish_reason;
                            // const index = result.index;
                            console.log(message.tone);
                            console.log('Sending response:', { editedPrompt: textCompletion });
                            port.postMessage({ editedPrompt: textCompletion });
                            console.log('Response sent');
                        }
                    }).catch(error => {
                        console.error(error);
                    });
                }
            });
        });
        port.onDisconnect.addListener(function() {
            port = null;
        });
    }
});


