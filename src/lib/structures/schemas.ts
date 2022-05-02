import type { Snowflake } from 'discord.js';
import type { CLASSES, KEYS, RANK, RANK_TITLES } from '../constants';
import type { Mobs } from './mobs';

// #region Others

export interface Effect {
	turns?: number;
	fids?: Snowflake[];
	debuff?: boolean;
}

type EffectsList =
	| 'PreCurse'
	| 'Judge'
	| 'Camouflage'
	| 'Buff'
	| 'Slow'
	| 'Taunt'
	| 'Barrier'
	| 'Vitals'
	| 'Sprint'
	| 'Bloodlust'
	| 'Multishoot'
	| 'Stun'
	| 'killedBy'
	| 'Poison'
	| 'Grievous Wounds'
	| 'Evade'
	| 'Evolve';

type Effects = {
	[key in EffectsList]?: Effect;
};

// #endregion

type AchievementsList = 'Kill:Hunter';

export interface Achievements {
	uid: Snowflake;
	achievements: { [key in AchievementsList]?: number };
}

export interface Blacklist {
	cid?: Snowflake;
	history?: Snowflake;
	loggedMessage?: string[];
	reason?: string;
	timestamp?: number;
	uid?: Snowflake;
	gid?: Snowflake;
}

export interface Boxes {
	blessed?: number;
	cursed?: number;
	normal?: number;
	uid: Snowflake;
}

export interface Busy {
	uid: Snowflake;
}

export interface Code {
	uid: Snowflake;
	codes: string[];
}

export interface Config {
	uid: Snowflake;
	stats: boolean;
	logs: boolean;
	ping: boolean;
}

export interface Cooldowns {
	uid: Snowflake;
	skills: { [key: string]: number };
	gate: number;
}

export interface Daily {
	uid: Snowflake;
	streak: number;
}

export interface DBL {
	uid: Snowflake;
	points: number;
	bot?: number;
	server?: number;
}

export interface Donator {
	uid: Snowflake;
	role: Snowflake;
}

type EQUIPMENTS = 'armor' | 'shoes' | 'gloves' | 'helmet' | 'ring' | 'necklace' | 'weapon1' | 'weapon2';

export interface Equipment {
	uid: Snowflake;
	unequipped: { [key: string]: number };
	equipped: { [key in EQUIPMENTS]?: string };
}

export interface GateChannel {
	cid: `${Snowflake}:${string}`;
	uid: Snowflake;
	isRed: boolean;
	rank: KEYS;
	/**
	 * @type 0 - Physic
	 * @type 1 - Magic
	 */
	logs: { [key: string]: string[] };
	rewards: {
		[key: string]: {
			golds?: number;
			exp?: number;
			manacrystal?: number;
			drops?: { [key: string]: number };
		};
	};
}

type GEMS = 'Opal' | 'Ruby' | 'Sapphire' | 'Emerald' | 'Diamond' | 'Amethyst' | 'Topaz';

export interface Gems {
	uid: Snowflake;
	gems: { [key in GEMS]?: number };
}

export interface Hunter_Fighting {
	uid: Snowflake;
	cid: Snowflake;
	class: CLASSES;
	exp: number;
	effect: Effects;
	player: number;
	position: { x: number; y: number };
	potions: {
		life: number;
		mana: number;
	};
	recovery: boolean;
	stats: {
		hp: number;
		mp: number;
		hp_max: number;
		mp_max: number;
		str: number;
		int: number;
		def: number;
		mr: number;
		vit: number;
		agi: number;
	};
}

export interface Hunter_Skills {
	uid: Snowflake;
	skills: { [key: string]: number };
}

export interface HunterInfo {
	uid: Snowflake;
	gid?: Snowflake;
	classid: CLASSES;
	rankid: RANK;
	titleid: RANK_TITLES;
	name: string;
}

export interface HunterStats {
	uid: Snowflake;
	agi: number;
	def: number;
	int: number;
	mr: number;
	str: number;
	vit: number;
	exp: number;
	hp: number;
	mp: number;
	sp: number;
}

export interface Keys {
	uid: Snowflake;
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	s: number;
	ss: number;
	uprank: number;
}

type Languages = 'en-US' | 'vi-VN' | 'id-ID';

export interface Language {
	uid: Snowflake;
	language: Languages;
}

export interface Lottery {
	uid: Snowflake;
	amount: number;
}

export interface Material {
	uid: Snowflake;
	materials: { [key: string]: number };
}

export interface Mob_Fighting {
	cid: Snowflake;
	mid: Snowflake;
	mob: Mobs;
	effect: Effects;
	position: { x: number; y: number };
	aliveFor: number;
	useSkill: boolean;
	killed: number;
	skills: { [key: string]: number };
	stats: {
		hp: number;
		hp_max: number;
		str: number;
		int: number;
		def: number;
		mr: number;
		agi: number;
		range: number;
	};
}

export interface Money {
	uid: Snowflake;
	golds: number;
	magiccore: number;
	manacrystal: number;
}

export interface Party {
	uid: Snowflake;
	members: Snowflake[];
	loots: { [key: string]: number };
}

export interface Penalty {
	uid: Snowflake;
	quest: number;
	warn: number;
	captcha: number;
}

export interface Potions {
	uid: Snowflake;
	life: number;
	mana: number;
}

export interface Recover {
	uid: Snowflake;
	has: boolean;
}

export interface Referral {
	uid: Snowflake;
	give: number;
	receive: number;
	codes: Snowflake[];
}

export interface Spam {
	uid: Snowflake;
}

export interface Stone {
	uid: Snowflake;
	thunder: number;
}

export interface Top {
	gid: Snowflake;
	level: string;
	rank: string;
	golds: string;
}
