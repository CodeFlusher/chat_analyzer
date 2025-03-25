import * as p from '@clack/prompts';

p.cancel('example cancel');
const a = await p.confirm({
	message: 'sdfds',
	active: 'yes',
	inactive: 'no',
	initialValue: true,
});
console.log(a);
const b = await p.text({ message: 'dsfd' });
p.outro('bye bye');
