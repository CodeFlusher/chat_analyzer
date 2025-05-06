import type {AiProvider} from "../aiModule";

const temperature = Number.parseFloat(
    (Bun.argv.find((item) => item.indexOf('--temperature=') !== -1) ?? '--temperature=0.5').split(
        '='
    )[1]
);

export class GemmaProvider implements AiProvider {

    port = '11434'

    setPort(port: string): void {
        this.port = port;
    }

    async generate(prompt: string, messages: string): Promise<string> {
        const res = await fetch(`http://localhost:${this.port}/api/generate`, {
            method: "POST",
            body: JSON.stringify({
                model: "gemma3",
                temperature: temperature,
                prompt: `${messages}\n\n ${prompt}`,
                stream: false
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        return (await res.json()).response
    }

}