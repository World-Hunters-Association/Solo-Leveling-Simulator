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

import { srcDir } from './constants';

import type { Snowflake } from 'discord.js';
import type { Code, Db } from 'mongodb';
import type {
	Achievements,
	Blacklist,
	Boxes,
	Busy,
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
	Referral,
	Spam,
	Stone,
	Top
} from './structures/schemas';
import type Utils from './Utils';

// Read env var
config({ path: join(srcDir, '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

export interface AlpetaOptions {
	owner?: Snowflake | Snowflake[];
	token?: string;
	root: string;
}

declare module '@sapphire/framework' {
	interface SapphireClient {
		config: AlpetaOptions;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		db: Db;
		utils: Utils;
	}
}

declare module 'mongodb' {
	interface Db {
		collection(name: 'achievements', options?: CollectionOptions | undefined): Collection<Achievements>;
		collection(name: 'blacklist', options?: CollectionOptions | undefined): Collection<Blacklist>;
		collection(name: 'boxes', options?: CollectionOptions | undefined): Collection<Boxes>;
		collection(name: 'busy', options?: CollectionOptions | undefined): Collection<Busy>;
		collection(name: 'code', options?: CollectionOptions | undefined): Collection<Code>;
		collection(name: 'config', options?: CollectionOptions | undefined): Collection<Config>;
		collection(name: 'cooldowns', options?: CollectionOptions | undefined): Collection<Cooldowns>;
		collection(name: 'daily', options?: CollectionOptions | undefined): Collection<Daily>;
		collection(name: 'dbl', options?: CollectionOptions | undefined): Collection<DBL>;
		collection(name: 'donator', options?: CollectionOptions | undefined): Collection<Donator>;
		collection(name: 'equipment', options?: CollectionOptions | undefined): Collection<Equipment>;
		collection(name: 'gate_channel', options?: CollectionOptions | undefined): Collection<GateChannel>;
		collection(name: 'gems', options?: CollectionOptions | undefined): Collection<Gems>;
		collection(name: 'hunter_skills', options?: CollectionOptions | undefined): Collection<Hunter_Skills>;
		collection(name: 'hunter_fighting', options?: CollectionOptions | undefined): Collection<Hunter_Fighting>;
		collection(name: 'hunterinfo', options?: CollectionOptions | undefined): Collection<HunterInfo>;
		collection(name: 'hunterstats', options?: CollectionOptions | undefined): Collection<HunterStats>;
		collection(name: 'keys', options?: CollectionOptions | undefined): Collection<Keys>;
		collection(name: 'language', options?: CollectionOptions | undefined): Collection<Language>;
		collection(name: 'lottery', options?: CollectionOptions | undefined): Collection<Lottery>;
		collection(name: 'material', options?: CollectionOptions | undefined): Collection<Material>;
		collection(name: 'mob_fighting', options?: CollectionOptions | undefined): Collection<Mob_Fighting>;
		collection(name: 'money', options?: CollectionOptions | undefined): Collection<Money>;
		collection(name: 'party', options?: CollectionOptions | undefined): Collection<Party>;
		collection(name: 'penalty', options?: CollectionOptions | undefined): Collection<Penalty>;
		collection(name: 'potions', options?: CollectionOptions | undefined): Collection<Potions>;
		collection(name: 'recover', options?: CollectionOptions | undefined): Collection<Recover>;
		collection(name: 'referral', options?: CollectionOptions | undefined): Collection<Referral>;
		collection(name: 'spam', options?: CollectionOptions | undefined): Collection<Spam>;
		collection(name: 'stone', options?: CollectionOptions | undefined): Collection<Stone>;
		collection(name: 'top', options?: CollectionOptions | undefined): Collection<Top>;
	}
}
