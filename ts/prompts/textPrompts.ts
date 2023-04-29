import {getTextLengthPrompt} from "../helpers";

// Temporary variables to be replaced with user input
const language = 'English';
const tone = 'positive';
const textLength: number | string = 'short';
const structure = false;

export const textPrompts = {
    assistant: 'Help me write this text by suggesting words and phrases',
    tone: tone ? `Make this text ${tone}` : 'Keep the same tone',
    language: language ? `Translate this text to ${language}` : 'Keep the same language as original text',
    textLength: getTextLengthPrompt(textLength),
    structure: structure ? 'Adjust the structure to the content of this text and make it more readable' : 'Keep the same structure',
    grammarAndSpelling: 'Fix the grammar and spelling in this text',
};