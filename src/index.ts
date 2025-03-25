import 'dotenv/config';
import * as p from '@clack/prompts';
import dayjs from 'dayjs';
import type { Message, TgChat } from '../types';
import { AiModule } from './aiModule';
import { MistralAiProvider } from './aiProviders/mistral';
import { ChatBuilder, type FormattedMessage } from './chatBuilder';
import color from 'picocolors';

p.intro(`${color.inverse('AI Chat Summarizer')} (made by ncesova and CodeFlusher`);

const { by, days } = await p.group(
	{
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
						initialValue: '3',
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
const { filterBy, isById, file } = await p.group(
	{
		filterBy: () =>
			//TODO: implement advanced filtering
			p.select({
				//or use multiselect @see https://github.com/bombshell-dev/clack/tree/main/packages/prompts#multi-select
				message: 'Filter by (not working. Just example)',
				initialValue: 'username',
				options: [
					{ value: 'id', label: 'Telegram Id', hint: '234234423423' },
					{ value: 'name', label: 'Public name', hint: 'Sova' },
					{ value: 'username', label: 'Username', hint: '@ncesova' },
				],
			}),
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
						if (message.slice(-5, 0) === '.json') {
							return message;
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

console.log(file);

const spinner = p.spinner();

spinner.start(`Reading ${file}...`);
const messages: TgChat = await Bun.file(file).json();

spinner.message('Mapping messages...');
const messageMap = new Map<number, Message>();
for (const message of messages.messages) {
	messageMap.set(message.id, message);
}

const yesterday = dayjs().subtract(days, 'day').toDate();

spinner.message(`Filtering Messages from: '${by}'`);

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

spinner.stop('Successfully filtered messages!');

p.log.info(`${filteredMessages.length}`);
// Bun.write("output.json", JSON.stringify(filteredMessages))

const aiSpinner = p.spinner();
aiSpinner.start('Generating response...');
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
