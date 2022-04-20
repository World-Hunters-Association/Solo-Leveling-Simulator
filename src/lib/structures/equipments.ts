import type { Snowflake } from 'discord.js';

export interface Equipments {
	readonly name: string;
	readonly emoji: `<${'a' | ''}:${string}:${Snowflake}>`;
	readonly uniqueCode: string;
	readonly class: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	readonly type: 'armor' | 'shoes' | 'gloves' | 'helmet' | 'ring' | 'necklace' | 'weapon';
	readonly sellPrice?: number;
	readonly stats: {
		hp?: number;
		mp?: number;
		def?: number;
		mr?: number;
		str?: number;
		int?: number;
		vit?: number;
		agi?: number;
	};
}

export const EQUIPMENTS: Equipments[] = [
	{
		name: 'Leather tunic',
		emoji: '<:Leathertunic:765578654800674847>',
		uniqueCode: 'nj3MH',
		class: 0,
		type: 'armor',
		stats: {
			int: 4,
			def: 3,
			agi: -1
		}
	},
	{
		name: 'Casual Hood',
		emoji: '<:Casualhood:765578655342133248>',
		uniqueCode: 'sLJF9',
		class: 0,
		type: 'helmet',
		stats: {
			int: 2,
			def: 2,
			agi: -1
		}
	},
	{
		name: 'Casual Gloves',
		emoji: '<:Casualgloves:765578655153258496>',
		uniqueCode: '2n7DG',
		class: 0,
		type: 'gloves',
		stats: {
			def: 1
		}
	},
	{
		name: 'Wanderer Shoes',
		emoji: '<:Wanderershoes:765578655199920188>',
		uniqueCode: 'zoW4H',
		class: 0,
		type: 'shoes',
		stats: {
			def: 2,
			mr: 2,
			agi: 1
		}
	},
	{
		name: 'Broken Sword',
		emoji: '<:Brokensword:765578611628965889>',
		uniqueCode: 'B2q4Y',
		class: 0,
		type: 'weapon',
		stats: {
			str: 3,
			agi: -1
		}
	},
	{
		name: 'Stick',
		emoji: '<:Stick:765578611947339797>',
		uniqueCode: '7iGHn',
		class: 0,
		type: 'weapon',
		stats: {
			int: 3,
			agi: -1
		}
	},
	{
		name: 'Wooden Shield',
		emoji: '<:Woodensheild:765578611649544213>',
		uniqueCode: '5UFWg',
		class: 0,
		type: 'weapon',
		stats: {
			def: 3,
			agi: -1
		}
	},
	{
		name: "Hunter's Bow",
		emoji: '<:HuntersBow:926067144079319080>',
		uniqueCode: 'PTT3a',
		class: 0,
		type: 'weapon',
		stats: {
			int: 2,
			str: 2,
			agi: -1
		}
	},
	{
		name: 'Handwritten Bible',
		emoji: '<:HandwrittenBible:926067144293244929>',
		uniqueCode: 'jL4oT',
		class: 0,
		type: 'weapon',
		stats: {
			int: 4,
			mr: 1,
			agi: -1,
			def: -1
		}
	},
	{
		name: 'Dagger',
		emoji: '<:Dagger:926067146046439464>',
		uniqueCode: 'Y6rTi',
		class: 0,
		type: 'weapon',
		stats: {
			str: 3,
			agi: -1
		}
	},
	{
		name: 'Grass Ring',
		emoji: '<:GrassRing:926067089679204353>',
		uniqueCode: 'oYF4Q',
		class: 0,
		type: 'ring',
		stats: {
			int: 1,
			mr: 2
		}
	},
	{
		name: 'Seashell Necklace',
		emoji: '<:SeashellNecklace:926067089813438484>',
		uniqueCode: '4hAKk',
		class: 0,
		type: 'necklace',
		stats: {
			vit: -1,
			mr: 2,
			def: -1
		}
	}
];
