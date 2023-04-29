import { createPromptSettings } from '../helpers';
import { GPTPrompts} from '../types/prompts.type';
import { textPrompts } from './textPrompts';

export const gptPrompts: GPTPrompts = {
    general_prompts: {
        fixGrammarAndSpelling: {
            name: 'Fix Grammar and Spelling',
            description: 'Its just going to fix the grammar and spelling in your text and will not change the text much',
            promptSettings: createPromptSettings({
                generalPrompt: textPrompts.grammarAndSpelling,
                textLength: textPrompts.textLength,
                structure: textPrompts.structure,
            }),
        },
        writeAssistant: {
            name: 'Writer Assistant',
            description: 'It will help you write the text by suggesting words and phrases. By default it write a text with correct grammar and spelling',
            promptSettings: createPromptSettings({
                generalPrompt: textPrompts.assistant,
            }),
        },
        changeTone: {
            name: 'Adjust Tone',
            description: 'Adjust the tone of your text to be more formal, assertive, neutral or maybe even more casual',
            promptSettings: createPromptSettings({
                generalPrompt: textPrompts.tone,
                textLength: textPrompts.textLength,
                structure: textPrompts.structure,
                language: textPrompts.language,
            }),
        },
    },
};
