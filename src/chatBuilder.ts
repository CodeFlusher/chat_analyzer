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
	getRaw(): Message[];
	getFormatted(): FormattedMessage[];
}

class ChatBuilder implements IChatBuilder {
	private chatMessages: Message[];

	constructor(messages: Message[]) {
		this.chatMessages = messages;
	}

	by(name: string): this {
		this.chatMessages = this.chatMessages.filter(
			(message) => message.from === name,
		);
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

	getRaw(): Message[] {
		return this.chatMessages;
	}

	getFormatted(): FormattedMessage[] {
		return this.chatMessages.map((message) => {
			return {
				name: message.from,
				message: message.text,
			} as FormattedMessage;
		});
	}
}

export { ChatBuilder };
