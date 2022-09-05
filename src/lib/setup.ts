import '@devtomio/plugin-botlist/register';
import '@kaname-png/plugin-statcord/register';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';
import 'reflect-metadata';

import * as colorette from 'colorette';
import { inspect } from 'util';

import type { InternationalizationContext } from '@sapphire/plugin-i18next';
import type { Awaitable } from '@sapphire/utilities';
import type { Snowflake } from 'discord.js';
import type { Code, Db } from 'mongodb';
import type { Constants } from '../utils/constants';
import type FunctionsUtils from '../utils/functions';
import type NotificationsUtils from '../utils/notifications';
import type { RPG } from './structures/RPG';
import type {
	Blacklist,
	Boxes,
	Busy,
	Challenges,
	Config,
	Cooldowns,
	Daily,
	DBL,
	Donator,
	Equipment,
	GateChannel,
	Gems,
	Guild,
	HunterInfo,
	HunterStats,
	Hunter_Skills,
	Keys,
	Language,
	Lottery,
	Material,
	Mob_Fighting,
	Money,
	Notifications,
	Party,
	Penalty,
	Potions,
	Recover,
	Stone,
	Top
} from './structures/schemas';
import type { UtilsStore } from './structures/UtilsStore';

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

export interface AlpetaOptions {
	owner?: Snowflake | Snowflake[];
	token?: string;
	root: string;
}

declare module '@sapphire/plugin-i18next' {
	interface InternationalizationHandler {
		fetchLanguageWithDefault: (context: InternationalizationContext) => Awaitable<string>;
	}
}

declare module '@sapphire/framework' {
	interface SapphireClient {
		config: AlpetaOptions;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		constants: Constants;
		db: Db;
		$db: Db;
		functions: FunctionsUtils;
		notifications: NotificationsUtils;
	}

	interface StoreRegistryEntries {
		utils: UtilsStore;
	}
}

interface Collections {
	blacklist: Blacklist;
	boxes: Boxes;
	busy: Busy;
	challenges: Challenges;
	code: Code;
	config: Config;
	cooldowns: Cooldowns;
	daily: Daily;
	dbl: DBL;
	donator: Donator;
	equipment: Equipment;
	gate_channel: GateChannel;
	gems: Gems;
	guild: Guild;
	hunter_skills: Hunter_Skills;
	hunter: RPG.Hunter;
	hunterinfo: HunterInfo;
	hunterstats: HunterStats;
	keys: Keys;
	language: Language;
	lottery: Lottery;
	material: Material;
	mob_fighting: Mob_Fighting;
	money: Money;
	notifications: Notifications;
	party: Party;
	penalty: Penalty;
	potions: Potions;
	recover: Recover;
	stone: Stone;
	top: Top;
}

declare module 'mongodb' {
	interface Db {
		collection<T extends keyof Collections>(name: T, options?: CollectionOptions): Collection<Collections[T]>;
	}
}
