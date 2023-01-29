import { OpenAI, getRequiredEnv, openAiPromptForSummary, openAiPromptForTags } from 'utils';
import type { Actions } from './$types';

const openAi = new OpenAI(getRequiredEnv('OPEN_AI_KEY'));

export const actions = {
	addNote: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		const [summaryData, tagsData] = await Promise.all([
			openAi.createCompletion(
				openAiPromptForSummary({
					title: formData.title.toString(),
					content: formData.content.toString()
				}),
				{ maxTokens: 80, temperature: 0.7 }
			),
			openAi.createCompletion(
				openAiPromptForTags({
					title: formData.title.toString(),
					content: formData.content.toString()
				}),
				{ maxTokens: 60, temperature: 0.9 }
			)
		]);

		const summary = summaryData.choices.map((choice) => choice.text.replace(/[^a-zA-Z0-9 ]/g, ''));
		let tags = tagsData.choices.map((choice) => choice.text);

		tags = tags
			.map((tag) =>
				tag
					.replace(/[^a-zA-Z0-9 ]/g, '')
					.split(/\s,|-/)
					.map((tag) => tag.trim())
					.filter((tag) => tag !== '')
			)
			.flat()
			.filter((tag, index, self) => self.indexOf(tag) === index);
		tags = tags.map((tag) => tag.split(' ')).flat();

		return { tags, summary };
	}
} satisfies Actions;
