import dayjs from "dayjs";
import type { Message, TgChat } from "../types";
import isBetween from "dayjs/plugin/isBetween";
import { messagesFromJSON } from "@mistralai/mistralai/models/components";
dayjs.extend(isBetween);

export type FormattedMessage = {
	name: string;
	reply_to?: string;
	reply_original_message: string;
	date: string;
	message: string;
}

interface MessageChunk {
	from: Date;
	to: Date;
	content: Message[];
}

interface IChatBuilder {
	by(name: string): this;
	from(date: Date | string): this;
	to(date: Date | string): this;
	getChunked(by?: number): MessageChunk[];
	build(): Message[];
}

class ChatBuilder implements IChatBuilder {
	private chatMessages: Message[];

	constructor(messages: Message[]) {
		this.chatMessages = messages;
	}

	byId(username: string): this {
		
		this.chatMessages = this.chatMessages.filter(message => {
			if(!message.from_id){
				return false;	
			}
			return message.from_id.indexOf(username) !== -1
		})
		return this;
	}

	by(name: string | string[]): this {
		if (Array.isArray(name)) {
			this.chatMessages = this.chatMessages.filter((message) =>
				name.includes(message.from ?? "NOT EXIST"),
			);
		} else {
			this.chatMessages = this.chatMessages.filter(
				(message) => {
					if(!message.from){
						return false
					}
					return message.from.indexOf(name) !== -1
				},
			);
		}

		return this;
	}

	from(date: Date | string): this {
		this.chatMessages = this.chatMessages.filter((message) =>
			dayjs(message.date).isAfter(dayjs(date)),
		);
		return this;
	}

	to(date: Date | string): this {
		this.chatMessages = this.chatMessages.filter((message) =>
			dayjs(message.date).isBefore(dayjs(date)),
		);
		return this;
	}

	getChunked(by = 1): MessageChunk[] {
		const messagesCopy = this.chatMessages.toReversed();
		let dateFrom = dayjs(messagesCopy.at(0)?.date);
		let dateTo = dateFrom.subtract(by, "hour");
		const result: MessageChunk[] = [];
		let buffer: Message[] = [];
		for (const message of messagesCopy) {
			if (dayjs(message.date).isBetween(dateFrom, dateTo)) {
				buffer.push(message);
			} else {
				result.push({
					from: dateFrom.toDate(),
					to: dateTo.toDate(),
					content: buffer,
				});
				buffer = [message];
				dateTo = dateTo.subtract(1, "hour");
				dateFrom = dateFrom.subtract(1, "hour");
			}
		}
		return result;
	}

	build(): Message[] {
		return this.chatMessages;
	}
}

export { ChatBuilder };
