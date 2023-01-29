export interface Completion {
	model?: Engine;
	maxTokens?: number;
	temperature?: number;
	bestOf?: number;
	topP?: number;
	n?: number;
	stream?: boolean;
	logprobs?: number | null;
	stop?: string;
}

export interface CompletionData {
	id: string;
	object: string;
	created: number;
	model: Engine;
	choices: CompletionChoice[];
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

export interface CompletionChoice {
	text: string;
	index: number;
	logprobs: number | null;
	finish_reason: string;
}

export type Engine = 'text-davinci-002';

export class OpenAI {
	constructor(private secretKey: string) {}

	/**
	 * https://beta.openai.com/docs/api-reference/completions/create
	 */
	public async createCompletion(
		prompt: string,
		completion?: Partial<Completion>
	): Promise<CompletionData> {
		const { model, maxTokens, temperature, bestOf, topP, n, stream, logprobs, stop } = {
			model: 'text-davinci-002',
			maxTokens: 10,
			temperature: 0.1,
			bestOf: 1,
			n: 1,
			...completion
		};

		const body = {
			prompt,
			max_tokens: maxTokens,
			temperature,
			best_of: bestOf,
			top_p: topP,
			n,
			stream,
			logprobs,
			stop
		};

		const response = await fetch(`https://api.openai.com/v1/engines/${model}/completions`, {
			body: JSON.stringify(body),
			headers: this.getHeaders(),
			method: 'POST'
		});

		return response.json();
	}

	private getHeaders() {
		return {
			Authorization: `Bearer ${this.secretKey}`,
			'Content-Type': 'application/json'
		};
	}
}
