const url = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
let port = null;

chrome.storage.local.set({
    apiKey: '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',
});

console.log('check');
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
                            const result = response.choices[0];
                            const text = result.text;
                            const finishReason = result.finish_reason;
                            const index = result.index;
                            console.log(message.tone);
                            console.log('Sending response:', { editedPrompt: text });
                            port.postMessage({ editedPrompt: text });
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

function getApiKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('apiKey', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.apiKey);
            }
        });
    });
}

function usePreferredTone(promptText, promptTone) {
    return promptText + '\\n\\n Rewrite this prompt so it has a formal and' + promptTone + 'sound, keep the bullets (if exists) in tact, also keep the same structure. Use the same language that is used in a prompt.';
}

function getCompletion(promptText, promptTone, apiKey, url) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: usePreferredTone(promptText, promptTone),
            temperature: 1,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 1,
            presence_penalty: 1,
        }),
    };

    return fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}
