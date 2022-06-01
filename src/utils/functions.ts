import type { SlashCommandBuilder } from '@discordjs/builders';
import type { PieceContext } from '@sapphire/framework';
import { BaseCommandInteraction, Message, MessageComponentInteraction } from 'discord.js';

import { resolveKey } from '@sapphire/plugin-i18next';

import { Utils } from '../lib/structures/Utils';

import type { APIMessage, LocalizationMap } from 'discord.js/node_modules/discord-api-types/v10';
export default class FunctionsUtils extends Utils {
	public constructor(context: PieceContext) {
		super(context);
	}

	public MaxHPCalc(vit: number, level: number) {
		return Math.round(100 + level * 5 + vit * 3);
	}

	public MaxMPCalc(int: number, level: number) {
		return Math.round(100 + level * 5 + int * 0.5);
	}

	public MaxLevelExpCalc(level: number) {
		let maxLevelExp = 280;
		for (let i = 1; i < level; i++) {
			maxLevelExp += Math.round((110 * (i + 1) ** (3 / 2)) / 10) * 10;
		}
		return level ? maxLevelExp : 0;
	}

	public HunterLevelCalc(exp: number) {
		let level = 1;
		while (exp >= this.MaxLevelExpCalc(level)) {
			level++;
		}
		return level;
	}

	public formatNumber(number: number): string {
		return this.container.functions.formatNumber(number);
	}

	public async sendRetryMessage(target: Message): Promise<Message>;
	public async sendRetryMessage(target: BaseCommandInteraction | MessageComponentInteraction): Promise<APIMessage | Message>;
	public async sendRetryMessage(target: Message | BaseCommandInteraction | MessageComponentInteraction): Promise<APIMessage | Message> {
		const RandomRetryMessage = (await resolveKey(target, 'validation:retry', { returnObjects: true })) as string[];

		if (target instanceof Message) {
			return target.channel.send({ content: this.pickRandom(RandomRetryMessage) });
		}

		if (target.replied || target.deferred) return target.editReply({ content: this.pickRandom(RandomRetryMessage) });

		return target.reply({
			content: this.pickRandom(RandomRetryMessage),
			fetchReply: true
		});
	}

	public pickRandom<T>(array: readonly T[]): T {
		const { length } = array;
		return array[Math.floor(Math.random() * length)];
	}

	public setNameAndDescriptions(constructor: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>, ...keys: [string, string][]) {
		const [nameKey, descriptionKey] = keys.shift()!;
		this.setNameAndDescription(constructor, nameKey, descriptionKey);
		if (Boolean(keys.length)) constructor.options.forEach((option, ind) => this.setNameAndDescription(option, keys[ind][0], keys[ind][1]));
	}

	public reduceString(string: string, maxLength: number) {
		if (string.length <= maxLength) return string;
		return `${string.slice(0, maxLength - 3)}...`;
	}

	private setNameAndDescription(constructor: any, nameKey: string, descriptionKey: string) {
		const names = this.slashNameLocalizations(nameKey);
		const descriptions = this.slashDescriptionLocalizations(descriptionKey);
		Reflect.set(constructor, 'name', names['en-US']);
		Reflect.set(constructor, 'description', descriptions['en-US']);
		Reflect.set(constructor, 'name_localizations', names);
		Reflect.set(constructor, 'description_localizations', descriptions);
	}

	private slashNameLocalizations(key: string): LocalizationMap {
		return Object.fromEntries(
			this.container.constants.DISCORD_SUPPORTED_LANGUAGES.map((locale) => {
				const t = this.container.i18n.format(locale, `${key}`).toLowerCase().replace(/\s+/g, '-');
				if (t.length > 32)
					throw new Error(`Command name length cannot be more than 32 characters. At language key: ${key}, locale: ${locale}`);
				return [locale, t];
			})
		);
	}

	private slashDescriptionLocalizations(key: string): LocalizationMap {
		return Object.fromEntries(
			this.container.constants.DISCORD_SUPPORTED_LANGUAGES.map((locale) => {
				const t = this.container.i18n.format(locale, `${key}`);
				return [locale, this.reduceString(t.split('\n')[0], 100)];
			})
		);
	}
}

declare module '../lib/structures/UtilsStore' {
	interface UtilsStore {
		get(name: 'functions'): FunctionsUtils;
	}
}
