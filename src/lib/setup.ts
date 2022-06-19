// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import '@devtomio/plugin-botlist/register';
import '@kaname-png/plugin-statcord/register';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';
import 'reflect-metadata';

import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';

import type { InternationalizationContext } from '@sapphire/plugin-i18next';
import type { Awaitable } from '@sapphire/utilities';
import type { Snowflake } from 'discord.js';
import type { Code, Db } from 'mongodb';
import type ConstantsUtils from '../utils/constants';
import type FunctionsUtils from '../utils/functions';
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
	HunterInfo,
	HunterStats,
	Hunter_Fighting,
	Hunter_Skills,
	Keys,
	Language,
	Lottery,
	Material,
	Mob_Fighting,
	Money,
	Party,
	Penalty,
	Potions,
	Recover,
	Spam,
	Stone,
	Top
} from './structures/schemas';
import type { UtilsStore } from './structures/UtilsStore';

// Read env var
config({ path: join(join(join(__dirname, '..', '..'), 'src'), '.env') });

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
		constants: ConstantsUtils;
		db: Db;
		functions: FunctionsUtils;
	}

	interface StoreRegistryEntries {
		utils: UtilsStore;
	}
}

declare module 'mongodb' {
	interface Db {
		collection(name: 'blacklist', options?: CollectionOptions): Collection<Blacklist>;
		collection(name: 'boxes', options?: CollectionOptions): Collection<Boxes>;
		collection(name: 'busy', options?: CollectionOptions): Collection<Busy>;
		collection(name: 'challenges', options?: CollectionOptions): Collection<Challenges>;
		collection(name: 'code', options?: CollectionOptions): Collection<Code>;
		collection(name: 'config', options?: CollectionOptions): Collection<Config>;
		collection(name: 'cooldowns', options?: CollectionOptions): Collection<Cooldowns>;
		collection(name: 'daily', options?: CollectionOptions): Collection<Daily>;
		collection(name: 'dbl', options?: CollectionOptions): Collection<DBL>;
		collection(name: 'donator', options?: CollectionOptions): Collection<Donator>;
		collection(name: 'equipment', options?: CollectionOptions): Collection<Equipment>;
		collection(name: 'gate_channel', options?: CollectionOptions): Collection<GateChannel>;
		collection(name: 'gems', options?: CollectionOptions): Collection<Gems>;
		collection(name: 'hunter_skills', options?: CollectionOptions): Collection<Hunter_Skills>;
		collection(name: 'hunter_fighting', options?: CollectionOptions): Collection<Hunter_Fighting>;
		collection(name: 'hunterinfo', options?: CollectionOptions): Collection<HunterInfo>;
		collection(name: 'hunterstats', options?: CollectionOptions): Collection<HunterStats>;
		collection(name: 'keys', options?: CollectionOptions): Collection<Keys>;
		collection(name: 'language', options?: CollectionOptions): Collection<Language>;
		collection(name: 'lottery', options?: CollectionOptions): Collection<Lottery>;
		collection(name: 'material', options?: CollectionOptions): Collection<Material>;
		collection(name: 'mob_fighting', options?: CollectionOptions): Collection<Mob_Fighting>;
		collection(name: 'money', options?: CollectionOptions): Collection<Money>;
		collection(name: 'party', options?: CollectionOptions): Collection<Party>;
		collection(name: 'penalty', options?: CollectionOptions): Collection<Penalty>;
		collection(name: 'potions', options?: CollectionOptions): Collection<Potions>;
		collection(name: 'recover', options?: CollectionOptions): Collection<Recover>;
		collection(name: 'spam', options?: CollectionOptions): Collection<Spam>;
		collection(name: 'stone', options?: CollectionOptions): Collection<Stone>;
		collection(name: 'top', options?: CollectionOptions): Collection<Top>;
	}
}
