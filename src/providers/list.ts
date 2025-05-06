import {GemmaProvider} from "./gemma";
import {MistralAiProvider} from "./mistral";

export const Providers = {
    gemma: new GemmaProvider(),
    mistral: new MistralAiProvider(),
}