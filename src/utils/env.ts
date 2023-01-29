import dotenv from 'dotenv';

interface Env {
	OPEN_AI_KEY: string;
}

export function getRequiredEnv<T extends keyof Env>(key: T): Env[T] {
	const value = getEnv(key);

	if (!value) throw new Error(`Missing environment variable: ${key}`);

	return value;
}

export function getEnv<T extends keyof Env>(key: T): Env[T] | undefined {
	const config = dotenv.config().parsed;

	return config?.[key] ?? process.env?.[key];
}
