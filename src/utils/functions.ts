import type {
	SlashCommandAttachmentOption,
	SlashCommandBooleanOption,
	SlashCommandBuilder,
	SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandMentionableOption,
	SlashCommandNumberOption,
	SlashCommandRoleOption,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandUserOption
} from '@discordjs/builders';
import type { PieceContext } from '@sapphire/framework';
import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { BaseCommandInteraction, Message, MessageComponentInteraction } from 'discord.js';

import { resolveKey } from '@sapphire/plugin-i18next';

import { Utils } from '../lib/structures/Utils';

import type { DurationFormatAssetsTime } from '@sapphire/time-utilities';
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

	public setNameAndDescriptions<
		T extends Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandBuilder | SlashCommandSubcommandBuilder,
		nameKey extends string,
		desccriptionKey extends string,
		type extends keyof OptionTypes,
		options extends OptionTypes[type]
	>(
		constructor: T,
		mainKey: [
			nameKey,
			desccriptionKey,
			[nameKey?, desccriptionKey?, [nameKey, desccriptionKey, [nameKey, desccriptionKey, nameKey[]?, Partial<options>?, type?][]?][]?][]?
		],
		...keys: [nameKey, desccriptionKey, nameKey[]?, Partial<options>?, type?][]
	) {
		this.setNameAndDescription(constructor, mainKey.shift() as '', mainKey.shift() as '');
		if (mainKey.length) {
			const Keys = mainKey.shift() as [
				nameKey?,
				desccriptionKey?,
				[nameKey, desccriptionKey, [nameKey, desccriptionKey, nameKey[]?, Partial<options>?, type?][]?][]?
			][];
			Keys.forEach((p) => {
				if (Boolean(p[0]) && Boolean(p[1]))
					(constructor as SlashCommandBuilder).addSubcommandGroup((g) => {
						this.setNameAndDescription(g, p[0]!, p[1]!);
						this.addSubcommandAndSetNameAndDescription(g, p[2]!);
						return g;
					});
				if (!p[0] && !p[1] && Boolean(p[2])) {
					this.addSubcommandAndSetNameAndDescription(constructor as SlashCommandBuilder, p[2]!);
				}
			});
		}
		if (Boolean(keys.length)) {
			keys.forEach((key, ind) => {
				if (Boolean(key[3]))
					constructor[`add${ApplicationCommandOptionType[key[3]!.type!] as 'String'}Option`]((o) => {
						this.setNameAndDescription(o, ...key);
						Object.entries(key[3]!).forEach(([k, v]) => Reflect.set(o, k, v));
						return o;
					});
				else this.setNameAndDescription(constructor.options[ind], ...key);
			});
		}
	}

	public reduceString(string: string, maxLength: number) {
		if (string.length <= maxLength) return string;
		return `${string.slice(0, maxLength - 3)}...`;
	}

	public timeUnitsLocalizations(locale: string): DurationFormatAssetsTime {
		return this.container.i18n.format(locale, 'common:timeUnits', { returnObjects: true });
	}

	public slashNameLocalizations(key: string): LocalizationMap {
		return Object.fromEntries(
			this.container.constants.SUPPORTED_LANGUAGES.map((locale) => {
				const t = this.container.i18n.format(locale, `${key}`).toLowerCase().replace(/\s+/g, '-');
				if (t.length > 32)
					throw new Error(`Command name length cannot be more than 32 characters. At language key: ${key}, locale: ${locale}`);
				return [locale, t];
			})
		);
	}

	public slashDescriptionLocalizations(key: string): LocalizationMap {
		return Object.fromEntries(
			this.container.constants.SUPPORTED_LANGUAGES.map((locale) => {
				const t = this.container.i18n.format(locale, `${key}`);
				return [locale, this.reduceString(t.split('\n')[0], 100)];
			})
		);
	}

	private addSubcommandAndSetNameAndDescription<
		nameKey extends string,
		desccriptionKey extends string,
		type extends keyof OptionTypes,
		options extends OptionTypes[type]
	>(
		constructor: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder,
		keys: [nameKey, desccriptionKey, [nameKey, desccriptionKey, nameKey[]?, Partial<options>?, type?][]?][]
	) {
		keys.forEach((k) =>
			constructor.addSubcommand((s) => {
				if (Boolean(k[2])) this.setNameAndDescriptions(s, [k[0]!, k[1]!], ...k[2]!);
				else this.setNameAndDescriptions(s, [k[0]!, k[1]!]);
				return s;
			})
		);
	}

	private setNameAndDescription<type extends keyof OptionTypes, options extends OptionTypes[type]>(
		constructor: any,
		nameKey: string,
		descriptionKey: string,
		choices?: string[],
		_?: Partial<options>,
		__?: type
	) {
		const names = this.slashNameLocalizations(nameKey);
		const descriptions = this.slashDescriptionLocalizations(descriptionKey);
		Reflect.set(constructor, 'name', names['en-US']);
		Reflect.set(constructor, 'description', descriptions['en-US']);
		Reflect.set(constructor, 'name_localizations', names);
		Reflect.set(constructor, 'description_localizations', descriptions);
		if (choices)
			Reflect.set(
				constructor,
				'choices',
				choices.map((key) => {
					const names = this.slashDescriptionLocalizations(key);
					return { name: names['en-US'], value: names['en-US'], name_localizations: names };
				})
			);
	}
}

declare module '../lib/structures/UtilsStore' {
	interface UtilsStore {
		get(name: 'functions'): FunctionsUtils;
	}
}

interface OptionTypes {
	String: SlashCommandStringOption;
	Integer: SlashCommandIntegerOption;
	Boolean: SlashCommandBooleanOption;
	User: SlashCommandUserOption;
	Channel: SlashCommandChannelOption;
	Role: SlashCommandRoleOption;
	Mentionable: SlashCommandMentionableOption;
	Number: SlashCommandNumberOption;
	Attachment: SlashCommandAttachmentOption;
}
