import {Mistral} from '@mistralai/mistralai';
import type {AiProvider} from '../aiModule';

const temperature = Number.parseFloat(
    (Bun.argv.find((item) => item.indexOf('--temperature=') !== -1) ?? '--temperature=0.5').split(
        '='
    )[1]
);

export class MistralAiProvider implements AiProvider {
    mistral: Mistral;

    constructor() {
        this.mistral = new Mistral({
            apiKey: process.env.MISTRAL_API_KEY ?? '',
        });
    }

    async generate(prompt: string, messages: string): Promise<string> {
        const response = await this.mistral.chat.complete({
            model: 'mistral-large-latest',
            temperature: temperature,
            messages: [
                {
                    content: `${prompt}`,
                    role: 'system',
                },
                {
                    content: messages,
                    role: 'user',
                },
            ],
        });
        // @ts-expect-error idk fix later
        return response.choices?.at(0)?.message.content ?? 'error';
    }
}
