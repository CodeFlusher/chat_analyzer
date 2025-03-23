export interface TgChat {
	id: number;
	messages: Message[];
	name: string;
	type: string;
}

export interface Message {
	id: number;
	type: string;
	date: Date | string; // TODO: convert to Date type
	date_unixtime: string;
	edited?: string;
	from?: string;
	from_id?: string;
	forwarded_from?: string;
	saved_from?: string;
	reply_to_message_id?: number;

	photo?: string;
	photo_file_size?: number;

	actor?: string;
	actor_id?: string;
	action?: string;

	file?: string;
	file_name?: string;
	fileSize?: number;
	thumbnail?: string;
	thumbnailFileSize?: number;
	mediaType?: string;
	performer?: string;
	title?: string;
	stickerEmoji?: string;
	mimeType?: string;
	durationSeconds?: number;
	width?: number;
	height?: number;

	text: string;
	text_entities: TextEntity[];
	reactions?: Reaction[];
}

interface Reaction {
	count: number;
	documentId?: string;
	emoji?: string;
	recent?: Recent[];
	type?: EmojiType;
}

interface Recent {
	date?: string;
	from?: string;
	fromId?: string;
}

interface TextEntity {
	collapsed?: boolean;
	documentId?: string;
	href?: string;
	text?: string;
	type?: string;
}

// Assuming EmojiType is an enum or a string type in TypeScript
type EmojiType = string; // or define an enum if you have specific values
