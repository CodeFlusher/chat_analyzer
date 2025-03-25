import { AnalyzePrompt } from './prompts';

export interface AiProvider {
	generate(prompt: string, messages: string): Promise<string>;
}

export class AiModule {
	ai: AiProvider;
	constructor(aiProvider: AiProvider) {
		this.ai = aiProvider;
	}

	getProfile(messages: string): Promise<string> {
		return this.ai.generate(AnalyzePrompt, messages);
	}
}
