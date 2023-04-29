export function getCompletion(promptText: string, promptTone: string, apiKey: string, url: string): Promise<any> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            // messages: [{ role: "user", content: usePreferredTone(promptText, promptTone) }]
        }),
    };

    return fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}