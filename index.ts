import "dotenv/config";
import type { Message, TgChat } from "./types";
import { ChatBuilder } from "./src/chatBuilder";
import dayjs from "dayjs";

const messages: TgChat = await Bun.file("result.json").json();

const yesterday = dayjs().subtract(1, "day");

const chat = new ChatBuilder(messages.messages);
console.log(chat);
