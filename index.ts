import "dotenv/config";
import type { Message, TgChat } from "./types";
import { ChatBuilder, FormattedMessage } from "./src/chatBuilder";
import dayjs from "dayjs";
import { AiModule } from "./src/aiModule";
import { MistralAiProvider } from "./src/aiProviders/mistral";

const bunArgs = Bun.argv.reverse()

let by = bunArgs.find(item => item.indexOf("--user=") !== -1)?.split("=")[1]
let days = Number.parseInt(bunArgs.find(item => item.indexOf("--days=") !== -1)?.split("=")[1]!)
let isById = bunArgs.indexOf('--filter-by-id') !== -1
let file = (bunArgs.find(item => item.indexOf("--file=") !== -1) ?? "--file=result.json").split("=")[1]

if(!by){
	throw Error("You must specify user!")
}

const messages: TgChat = await Bun.file(file).json();

const messageMap = new Map<number, Message>();

messages.messages.forEach(message => {
	messageMap.set(message.id, message)
})


const yesterday = dayjs().subtract(days, "day").toDate();

console.log(`Filtering Messages from: '${by}'`)

let chatBuilder = new ChatBuilder(messages.messages);

if(isById){
	chatBuilder = chatBuilder.byId(by!)
}else{
	chatBuilder = chatBuilder.by(by!)
}

let filteredMessages = chatBuilder.from(yesterday)
	.build()
	.map((message) => {
		let filteredMessage = {
				name: message.from,
				message: message.text,
				date: message.date,
		} as FormattedMessage;
		if(message.reply_to_message_id){
			let value = messageMap.get(message.reply_to_message_id)
			if(value){
				filteredMessage.reply_to = value.from
				filteredMessage.reply_original_message = value.text
			}
		}

		return filteredMessage
	});

console.log(filteredMessages.length);
// Bun.write("output.json", JSON.stringify(filteredMessages))
const mistral = new MistralAiProvider();
const aiModule = new AiModule(mistral);
const response = await aiModule.getProfile(JSON.stringify(filteredMessages));
Bun.write(`chat_sums/AiSummarize_${new Date().toLocaleString().replaceAll('\/', '_').replaceAll(',', '').replaceAll(" ", "_").replaceAll(":", "_")}.md`, response)
console.log(response);
