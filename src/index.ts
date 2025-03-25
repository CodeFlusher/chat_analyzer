import 'dotenv/config';
import * as p from '@clack/prompts';
import dayjs from 'dayjs';
import color from 'picocolors';
import type { Message, TgChat } from '../types';
import { AiModule } from './aiModule';
import { MistralAiProvider } from './providers/mistral';
import { ChatBuilder, type FormattedMessage } from './chatBuilder';

p.intro(`${color.inverse('AI Chat Summarizer')} (made by ncesova and CodeFlusher`);

const { by, days } = await p.group(
	{
		//TODO: add username fuzzy search
		by: async () =>
			String(
				await p.text({
					message: 'Enter user public name or telegram id',
					placeholder: 'Sova',
					validate: (message) => {
						if (message.length === 0) return 'You must specify user!';
					},
				})
			),
		days: async () =>
			Number.parseInt(
				String(
					await p.text({
						message: 'Enter amount of days from today to filter',
						placeholder: '3',
						validate: (message) => {
							if (message.length === 0) return 'Amount of days is required!';
							//TODO: implement number validation
						},
					})
				)
			),
	},
	{
		onCancel: () => {
			p.cancel('Operation cancelled.');
			process.exit(0);
		},
	}
);
const { isById, file } = await p.group(
	{
		// filterBy: () =>
		// 	//TODO: implement advanced filtering
		// 	p.select({
		// 		//or use multiselect @see https://github.com/bombshell-dev/clack/tree/main/packages/prompts#multi-select
		// 		message: 'Filter by (not working. Just example)',
		// 		initialValue: 'username',
		// 		options: [
		// 			{ value: 'id', label: 'Telegram Id', hint: '234234423423' },
		// 			{ value: 'name', label: 'Public name', hint: 'Sova' },
		// 			{ value: 'username', label: 'Username', hint: '@ncesova' },
		// 		],
		// 	}),
		isById: () =>
			p.confirm({
				message: 'Filter users by telegram id?',
				active: 'Yes',
				inactive: 'No',
				initialValue: false,
			}),
		file: async () =>
			String(
				await p.text({
					message: 'Name of telegram export .json file',
					initialValue: 'result.json',
					placeholder: 'result.json',
					validate: (message) => {
						if (message.slice(-5) !== '.json') {
							return 'File must be .json';
						}
					},
				})
			),
	},
	{
		onCancel: () => {
			p.cancel('Operation cancelled.');
			process.exit(0);
		},
	}
);

p.log.info(`Searching for messages from ${by} for the last ${days} day(s)...`);

p.log.step(`Reading ${file}...`);
const messages: TgChat = await Bun.file(file).json();

p.log.step('Mapping messages...');
const messageMap = new Map<number, Message>();
for (const message of messages.messages) {
	messageMap.set(message.id, message);
}

const yesterday = dayjs().subtract(days, 'day').toDate();

p.log.step(`Filtering Messages from: '${by}'`);

let chatBuilder = new ChatBuilder(messages.messages);

if (isById) {
	chatBuilder = chatBuilder.byId(by);
} else {
	chatBuilder = chatBuilder.by(by);
}

const filteredMessages = chatBuilder
	.from(yesterday)
	.build()
	.map((message) => {
		const filteredMessage = {
			name: message.from,
			message: message.text,
			date: message.date,
		} as FormattedMessage;
		if (message.reply_to_message_id) {
			const value = messageMap.get(message.reply_to_message_id);
			if (value) {
				filteredMessage.reply_to = value.from;
				filteredMessage.reply_original_message = value.text;
			}
		}

		return filteredMessage;
	});

if (filteredMessages.length === 0) {
	p.cancel('Messages not found :(');
	process.exit(0);
} else {
	p.log.success(`Successfully found ${filteredMessages.length} messages!`);
}

// Bun.write("output.json", JSON.stringify(filteredMessages))

const aiSpinner = p.spinner();
aiSpinner.start('Generating response');
const mistral = new MistralAiProvider();
const aiModule = new AiModule(mistral);
const response = await aiModule.getProfile(JSON.stringify(filteredMessages));
aiSpinner.stop('Response generated!');

Bun.write(
	`chat_sums/AiSummarize_${new Date().toLocaleString().replaceAll('/', '_').replaceAll(',', '').replaceAll(' ', '_').replaceAll(':', '_')}.md`,
	response
);
p.outro(
	`Find result in chat_sums/AiSummarize_${new Date().toLocaleString().replaceAll('/', '_').replaceAll(',', '').replaceAll(' ', '_').replaceAll(':', '_')}.md`
);
console.log(response);
