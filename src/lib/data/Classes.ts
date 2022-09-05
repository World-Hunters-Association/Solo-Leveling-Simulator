import type { RPG } from '../structures/RPG';

export const Classes: RPG.Class[] = [
	{
		id: 0,
		name: 'Unspecialized',
		expParams: [30, 20, 30, 30],
		params: [45, 30, 16, 16, 16, 16, 32, 32],
		learnings: [],
		traits: []
	},
	{
		id: 1,
		name: 'Assassin',
		expParams: [30, 20, 30, 30],
		params: [38, 20, 14, 15, 13, 16, 37, 39],
		learnings: [],
		traits: []
	},
	{
		id: 2,
		name: 'Fighter',
		expParams: [30, 20, 30, 30],
		params: [54, 14, 19, 17, 15, 17, 29, 27],
		learnings: [],
		traits: []
	},
	{
		id: 3,
		name: 'Healer',
		expParams: [25, 20, 30, 30],
		params: [30, 44, 13, 14, 14, 15, 24, 32],
		learnings: [],
		traits: []
	},
	{
		id: 4,
		name: 'Mage',
		expParams: [30, 20, 30, 30],
		params: [30, 44, 12, 11, 21, 20, 22, 18],
		learnings: [],
		traits: []
	},
	{
		id: 5,
		name: 'Ranger',
		expParams: [30, 20, 30, 30],
		params: [34, 23, 17, 14, 15, 16, 33, 31],
		learnings: [],
		traits: []
	},
	{
		id: 6,
		name: 'Tanker',
		expParams: [30, 20, 30, 30],
		params: [59, 17, 18, 18, 15, 20, 25, 21],
		learnings: [],
		traits: []
	}
];
