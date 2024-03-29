import type { Snowflake } from 'discord.js';
import type { CLASSES, KEYS, Mobs, RANK, RANK_TITLES } from '../../utils/constants';

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

type ChallengesList = 'Kill:Hunter';

export interface Challenges {
	uid: Snowflake;
	challenges: { [key in ChallengesList]?: number };
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
	boxes: {
		'Random Blessed Box'?: number;
		'Random Cursed Box'?: number;
		'Random Box'?: number;
	};
	uid: Snowflake;
}

export interface Busy {
	uid: Snowflake;
	reason?: string;
	messageURL?: string;
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

type cooldownCommands = 'gate' | 'daily' | 'weekly';

export interface Cooldowns {
	uid: Snowflake;
	skills: { [key: string]: number };
	commands: { [key in cooldownCommands]: number };
}

export interface Daily {
	uid: Snowflake;
	streak: number;
}

export interface DBL {
	uid: Snowflake;
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

interface Rewards extends Partial<Pick<Currencies, 'gold' | 'manaCrystal'>> {
	exp?: number;
	drops?: Material['materials'];
}

export interface GateChannel {
	cid: `${Snowflake}:${string}`;
	uid: Snowflake;
	/** @description Party leader ID */
	plid?: Snowflake;
	isRed: boolean;
	rank: KEYS;
	/**
	 * @type 0 - Physic
	 * @type 1 - Magic
	 */
	logs: { [key: string]: string[] };
	rewards: {
		[key: string]: Rewards;
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
	/** @description Party leader ID */
	plid?: Snowflake;
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
	keys: {
		'A-rank key': number;
		'B-rank key': number;
		'C-rank key': number;
		'D-rank key': number;
		'E-rank key': number;
		'S-rank key': number;
		'SS-rank key': number;
		'Uprank key': number;
	};
}

type Languages = 'en-US' | 'vi' | 'id-ID';

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

export interface Currencies {
	gold: number;
	magicCore: number;
	manaCrystal: number;
	votePoint: number;
}

export interface Money extends Currencies {
	uid: Snowflake;
}

export interface Party {
	uid: Snowflake;
	members: { uid: Snowflake; name: string }[];
	loots: { [key: string]: number };
	name: string;
}

export interface Penalty {
	uid: Snowflake;
	quest: number;
	warn: number;
	captcha: number;
}

export interface Potions {
	uid: Snowflake;
	potions: {
		'life potion': number;
		'mana potion': number;
	};
}

export interface Recover {
	uid: Snowflake;
	has: boolean;
}

export interface Stone {
	uid: Snowflake;
	stones: {
		'thunder stone': number;
	};
}

export interface Top {
	gid: Snowflake;
	date: Date;
	top: {
		level: { uid: Snowflake; exp: number; level: number }[];
		rank: { uid: Snowflake; rank: RANK }[];
		gold: { uid: Snowflake; gold: number }[];
	};
}
