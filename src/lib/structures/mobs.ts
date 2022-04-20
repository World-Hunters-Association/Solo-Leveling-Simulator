import type { Snowflake } from 'discord.js';

import { RANK, EMOJIS } from '../constants';
import { DROPS, Drops } from './drops';

export interface Mobs {
	readonly name: string;
	readonly emoji: `<${'a' | ''}:${string}:${Snowflake}>` | string;
	readonly rank: RANK;
	readonly isBoss: boolean;
	readonly species: string;
	readonly drops?: Drops[];
	readonly stats: {
		readonly hp: number;
		readonly str: number;
		readonly int: number;
		readonly def: number;
		readonly mr: number;
		readonly agi: number;
		readonly range: number;
	};
}

export const MOBS: readonly Mobs[] = [
	{
		name: "Blue Poison Fang's Rasaka",
		emoji: EMOJIS.MOBS.BOSS_RASAKA,
		rank: RANK['E-Rank'],
		isBoss: true,
		species: 'Rasaka',
		drops: [...DROPS].filter((drop) => drop.species === 'Rasaka'),
		stats: {
			hp: 200,
			str: 40,
			int: 60,
			def: 85,
			mr: 85,
			agi: 3,
			range: 3
		}
	},
	{
		name: 'Green Rasaka',
		emoji: EMOJIS.MOBS.GREEN_RASAKA,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Rasaka',
		drops: [...DROPS].filter((drop) => drop.species === 'Rasaka'),
		stats: {
			hp: 80,
			str: 30,
			int: 10,
			def: 30,
			mr: 30,
			agi: 2,
			range: 2
		}
	},
	{
		name: 'Purple Rasaka',
		emoji: EMOJIS.MOBS.PURPLE_RASAKA,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Rasaka',
		drops: [...DROPS].filter((drop) => drop.species === 'Rasaka'),
		stats: {
			hp: 80,
			str: 10,
			int: 30,
			def: 30,
			mr: 30,
			agi: 2,
			range: 2
		}
	},
	{
		name: 'Steel Fanged Raikan',
		emoji: EMOJIS.MOBS.BOSS_RAIKAN,
		rank: RANK['E-Rank'],
		isBoss: true,
		species: 'Raikan',
		drops: [...DROPS].filter((drop) => drop.species === 'Raikan'),
		stats: {
			hp: 200,
			str: 95,
			int: 10,
			def: 60,
			mr: 60,
			agi: 4,
			range: 1
		}
	},
	{
		name: 'Blue Raikan',
		emoji: EMOJIS.MOBS.BLUE_RAIKAN,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Raikan',
		drops: [...DROPS].filter((drop) => drop.species === 'Raikan'),
		stats: {
			hp: 90,
			str: 50,
			int: 10,
			def: 10,
			mr: 10,
			agi: 3,
			range: 1
		}
	},
	{
		name: 'Yellow Raikan',
		emoji: EMOJIS.MOBS.YELLOW_RAIKAN,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Raikan',
		drops: [...DROPS].filter((drop) => drop.species === 'Raikan'),
		stats: {
			hp: 100,
			str: 30,
			int: 10,
			def: 30,
			mr: 30,
			agi: 3,
			range: 1
		}
	},
	{
		name: 'Black Shadow Razan',
		emoji: EMOJIS.MOBS.BOSS_RAZAN,
		rank: RANK['E-Rank'],
		isBoss: true,
		species: 'Razan',
		drops: [...DROPS].filter((drop) => drop.species === 'Razan'),
		stats: {
			hp: 200,
			str: 70,
			int: 10,
			def: 100,
			mr: 90,
			agi: 3,
			range: 1
		}
	},
	{
		name: 'Purple Razan',
		emoji: EMOJIS.MOBS.PURPLE_RAZAN,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Razan',
		drops: [...DROPS].filter((drop) => drop.species === 'Razan'),
		stats: {
			hp: 90,
			str: 20,
			int: 10,
			def: 40,
			mr: 60,
			agi: 2,
			range: 1
		}
	},
	{
		name: 'Red Razan',
		emoji: EMOJIS.MOBS.RED_RAZAN,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Razan',
		drops: [...DROPS].filter((drop) => drop.species === 'Razan'),
		stats: {
			hp: 90,
			str: 30,
			int: 10,
			def: 50,
			mr: 30,
			agi: 2,
			range: 1
		}
	},
	{
		name: 'Razor Claw Briga',
		emoji: EMOJIS.MOBS.BOSS_BRIGA,
		rank: RANK['E-Rank'],
		isBoss: true,
		species: 'Briga',
		drops: [...DROPS].filter((drop) => drop.species === 'Briga'),
		stats: {
			hp: 200,
			str: 100,
			int: 10,
			def: 30,
			mr: 30,
			agi: 3,
			range: 1
		}
	},
	{
		name: 'Blue Briga',
		emoji: EMOJIS.MOBS.BLUE_BRIGA,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Briga',
		drops: [...DROPS].filter((drop) => drop.species === 'Briga'),
		stats: {
			hp: 90,
			str: 50,
			int: 10,
			def: 10,
			mr: 10,
			agi: 3,
			range: 1
		}
	},
	{
		name: 'Gray Briga',
		emoji: EMOJIS.MOBS.GRAY_BRIGA,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Briga',
		drops: [...DROPS].filter((drop) => drop.species === 'Briga'),
		stats: {
			hp: 90,
			str: 30,
			int: 10,
			def: 30,
			mr: 30,
			agi: 3,
			range: 1
		}
	},
	{
		name: 'Goblin',
		emoji: EMOJIS.MOBS.BOSS_GOBLIN,
		rank: RANK['E-Rank'],
		isBoss: true,
		species: 'Goblin',
		drops: [...DROPS].filter((drop) => drop.species === 'Goblin'),
		stats: {
			hp: 200,
			str: 70,
			int: 30,
			def: 30,
			mr: 30,
			agi: 4,
			range: 1
		}
	},
	{
		name: 'Blue Goblin',
		emoji: EMOJIS.MOBS.BLUE_GOBLIN,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Goblin',
		drops: [...DROPS].filter((drop) => drop.species === 'Goblin'),
		stats: {
			hp: 60,
			str: 50,
			int: 20,
			def: 10,
			mr: 10,
			agi: 4,
			range: 1
		}
	},
	{
		name: 'Red Goblin',
		emoji: EMOJIS.MOBS.RED_GOBLIN,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Goblin',
		drops: [...DROPS].filter((drop) => drop.species === 'Goblin'),
		stats: {
			hp: 50,
			str: 60,
			int: 20,
			def: 10,
			mr: 10,
			agi: 4,
			range: 1
		}
	},
	{
		name: 'Stone Golem',
		emoji: EMOJIS.MOBS.BOSS_STONE_GOLEM,
		rank: RANK['E-Rank'],
		isBoss: true,
		species: 'Stone Golem',
		drops: [...DROPS].filter((drop) => drop.species === 'Stone Golem'),
		stats: {
			hp: 300,
			str: 20,
			int: 20,
			def: 120,
			mr: 120,
			agi: 1,
			range: 2
		}
	},
	{
		name: 'Brown Stone Golem',
		emoji: EMOJIS.MOBS.BROWN_STONE_GOLEM,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Stone Golem',
		drops: [...DROPS].filter((drop) => drop.species === 'Stone Golem'),
		stats: {
			hp: 150,
			str: 20,
			int: 10,
			def: 50,
			mr: 50,
			agi: 1,
			range: 2
		}
	},
	{
		name: 'Green Stone Golem',
		emoji: EMOJIS.MOBS.GREEN_STONE_GOLEM,
		rank: RANK['E-Rank'],
		isBoss: false,
		species: 'Stone Golem',
		drops: [...DROPS].filter((drop) => drop.species === 'Stone Golem'),
		stats: {
			hp: 150,
			str: 10,
			int: 20,
			def: 50,
			mr: 50,
			agi: 1,
			range: 2
		}
	}
];
