/* eslint-disable @typescript-eslint/member-ordering */
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

import type { Constants } from './constants';
import type { DurationFormatAssetsTime } from '@sapphire/time-utilities';
import type { APIMessage, LocalizationMap } from 'discord.js/node_modules/discord-api-types/v10';
import type { Union } from 'ts-toolbelt';

export default class FunctionsUtils extends Utils {
	public constructor(context: PieceContext) {
		super(context);
	}

	public MaxHPCalc(base: number, level: number) {
		return Math.floor(((base * 100) / 99) * level);
	}

	public OtherStatsCalc(base: number, level: number) {
		return Math.floor(((base * 10) / 99) * level);
	}

	public MaxLevelExpCalc(level: number) {
		const base = 30;
		const extra = 20;
		const acc_a = 30;
		const acc_b = 30;

		return Math.round(
			(base * Math.pow(level - 1, 0.9 + acc_a / 250) * level * (level + 1)) / (6 + Math.pow(level, 2) / 50 / acc_b) + (level - 1) * extra
		);
	}

	public HunterLevelCalc(exp: number) {
		let level = 1;
		while (exp >= this.MaxLevelExpCalc(level)) {
			level++;
		}
		return level;
	}

	// public MobStatsCalc(level, )

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

	public getObjectTypeFromName<T extends keyof ConstantInterfaces, Tname extends ConstantInterfaces[T]['name']>(name: Tname) {
		return this.container.constants.DROPS.find((i) => i.name === name)
			? 'DROPS'
			: this.container.constants.ITEMS.find((i) => i.name === name)
			? 'ITEMS'
			: this.container.constants.EQUIPMENTS.find((i) => i.name === name)
			? 'EQUIPMENTS'
			: this.container.constants.HUNTER_SKILLS.find((i) => i.name === name)
			? 'HUNTER_SKILLS'
			: this.container.constants.MOB_SKILLS.find((i) => i.name === name)
			? 'MOB_SKILLS'
			: this.container.constants.MOBS.find((i) => i.name === name)
			? 'MOBS'
			: undefined;
	}

	public getObjectFromName<T extends keyof ConstantInterfaces, Tname extends ConstantInterfaces[T]['name']>(name: Tname): ObjectType[Tname] {
		const type = this.getObjectTypeFromName(name);
		if (!type) return undefined as unknown as any;
		return (this.container.constants[type] as unknown as any[]).find((i) => i.name === name);
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
		options?: Partial<options>,
		_?: type
	) {
		const names = this.slashNameLocalizations(nameKey);
		const descriptions = this.slashDescriptionLocalizations(descriptionKey);
		Reflect.set(constructor, 'name', names['en-US']);
		Reflect.set(constructor, 'description', descriptions['en-US']);
		Reflect.set(constructor, 'name_localizations', names);
		Reflect.set(constructor, 'description_localizations', descriptions);

		if ((options as unknown as OptionTypes['Number'])?.choices) {
			Reflect.set(
				constructor,
				'choices',
				(options as unknown as OptionTypes['Number']).choices?.map((c) => {
					const names = this.slashDescriptionLocalizations(c.name);
					return { name: names['en-US'], name_localizations: names, value: c.value };
				})
			);
			return;
		}

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

interface ConstantInterfaces {
	DROPS: Constants['DROPS'][number];
	ITEMS: Constants['ITEMS'][number];
	EQUIPMENTS: Constants['EQUIPMENTS'][number];
	HUNTER_SKILLS: Constants['HUNTER_SKILLS'][number];
	MOB_SKILLS: Constants['MOB_SKILLS'][number];
	MOBS: Constants['MOBS'][number];
}

type ObjectType = {
	[Key in ConstantInterfaces['DROPS']['name']]: Constants.Drops;
} & {
	[Key in ConstantInterfaces['EQUIPMENTS']['name']]: Constants.Equipments;
} & {
	[Key in Union.Diff<ConstantInterfaces['ITEMS']['name'], ConstantInterfaces['EQUIPMENTS']['name']>]: Constants.Items;
} & {
	[Key in ConstantInterfaces['HUNTER_SKILLS']['name']]: Constants.HunterSkills;
} & {
	[Key in ConstantInterfaces['MOB_SKILLS']['name']]: Constants.MobSkills;
} & {
	[Key in ConstantInterfaces['MOBS']['name']]: Constants.Mobs;
};

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
