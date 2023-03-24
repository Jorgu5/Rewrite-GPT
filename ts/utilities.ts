export function usePreferredTone(promptText: string, promptTone: string): string {
    return '' +
        'Rewrite the following text with following rules: \\n\\n ' +
        '1. Be ' + promptTone + ' as much as it is only possible. \\n\\n ' +
        '2. Keep the structure of text in tact. \\n\\n ' +
        '3. Make sure it is proper grammatical and uses proper spelling rules \\n\\n ' +
        '4. Translate to the same language that message is written \\n\\n' +
        promptText;
}