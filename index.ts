import "dotenv/config";
import { run } from "./ai";
import { getChatData } from "./src/chatBuilder";

const file = await getChatData();

// const from = new Date();
// from.setHours(from.getHours() - 2);
// console.log(from);

// const messages = file.messages.map((message) => ({
//   ...message,
//   date: new Date(message.date),
// }));

// const b = messages.filter((message) => messag);

const a = file.messages
	.filter((message) => message.from === "sova")
	.map((message) => {
		return {
			name: message.from,
			message: message.text,
		};
	});

const b = a.slice(6000);

console.log(b.length);
run(b);
