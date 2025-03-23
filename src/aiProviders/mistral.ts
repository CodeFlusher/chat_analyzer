import { Mistral } from "@mistralai/mistralai";
import type { AiProvider } from "../aiModule";

export class MistralAiProvider implements AiProvider {
	mistral: Mistral;
	constructor() {
		this.mistral = new Mistral({
			apiKey: process.env.MISTRAL_API_KEY ?? "",
		});
	}

	async generate(prompt: string, messages: string): Promise<string> {
		const response = await this.mistral.chat.complete({
			model: "mistral-large-latest",
			temperature: 0.5,
			messages: [
				{
					content: `${prompt} для ссылок используй формат https://t.me/c/<chatId>/<messsage_id>`,
					role: "system",
				},
				{
					content: messages,
					role: "user",
				},
			],
		});
		// @ts-expect-error idk fix later
		return response.choices?.at(0)?.message.content ?? "error";
	}
}
