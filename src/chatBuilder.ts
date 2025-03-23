import dayjs from "dayjs";
import type { Message, TgChat } from "../types";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

interface FormattedMessage {
	name: string;
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

	by(name: string | string[]): this {
		if (Array.isArray(name)) {
			this.chatMessages = this.chatMessages.filter((message) =>
				name.includes(message.from ?? "NOT EXIST"),
			);
		} else {
			this.chatMessages = this.chatMessages.filter(
				(message) => message.from === name,
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
