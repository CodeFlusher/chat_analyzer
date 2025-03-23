import "dotenv/config";
import type { Message, TgChat } from "./types";
import { ChatBuilder } from "./src/chatBuilder";
import dayjs from "dayjs";
import { AiModule } from "./src/aiModule";
import { MistralAiProvider } from "./src/aiProviders/mistral";

const messages: TgChat = await Bun.file("result.json").json();

const yesterday = dayjs().subtract(1, "day").toDate();

const filteredMessages = new ChatBuilder(messages.messages)
	.by("Zoom")
	.from(yesterday)
	.build()
	.map((message) => ({
		chatId: messages.id,
		content: {
			id: message.id,
			reply_to_message_id: message.reply_to_message_id,
			from: message.from,
			message: message.text,
		},
	}));

console.log(filteredMessages.length);
const mistral = new MistralAiProvider();
const aiModule = new AiModule(mistral);
const response = await aiModule.getProfile(JSON.stringify(filteredMessages));
console.log(response);
