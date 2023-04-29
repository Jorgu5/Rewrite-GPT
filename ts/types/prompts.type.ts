type Prompt = {
    name: string;
    description: string;
    promptSettings: PromptSettings;
};

export type PromptSettings = {
    generalPrompt: string;
    language?: string;
    textLength?: string;
    structure?: string;
};

export type GPTPrompts = {
    general_prompts: { [key: string]: Prompt };
};