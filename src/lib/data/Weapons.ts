import { Ids } from '../structures/Ids';
import { Types } from '../structures/Types';

import type { RPG } from '../structures/RPG';

export const Weapons: RPG.Weapon[] = [
	{
		name: 'Broken Sword',
		id: 1,
		emoji: '<:s:765578611628965889>',
		wtypeId: Types.Weapon.Sword,
		etypeId: Types.Equipment.Weapon,
		description: 'glossary:equipments.Broken Sword.description',
		params: {
			[Ids.Param.str]: 3,
			[Ids.Param.agi]: -1
		},
		price: 0,
		traits: []
	},
	{
		name: 'Stick',
		id: 2,
		emoji: '<:s:765578611947339797>',
		wtypeId: Types.Weapon.Wand,
		etypeId: Types.Equipment.Weapon,
		description: 'glossary:equipments.Stick.description',
		params: {
			[Ids.Param.int]: 3,
			[Ids.Param.agi]: -1
		},
		price: 0,
		traits: []
	},
	{
		name: "Hunter's Bow",
		id: 3,
		emoji: '<:s:926067144079319080>',
		wtypeId: Types.Weapon.Bow,
		etypeId: Types.Equipment.Weapon,
		description: "glossary:equipments.Hunter's Bow.description",
		params: {
			[Ids.Param.int]: 2,
			[Ids.Param.str]: 2,
			[Ids.Param.agi]: -1
		},
		price: 0,
		traits: []
	},
	{
		name: 'Handwritten Bible',
		id: 4,
		emoji: '<:s:926067144293244929>',
		wtypeId: Types.Weapon.Grimoire,
		etypeId: Types.Equipment.Weapon,
		description: 'glossary:equipments.Handwritten Bible.description',
		params: {
			[Ids.Param.int]: 4,
			[Ids.Param.mr]: 1,
			[Ids.Param.agi]: -1,
			[Ids.Param.def]: -1
		},
		price: 0,
		traits: []
	},
	{
		name: 'Dagger',
		id: 5,
		emoji: '<:s:926067146046439464>',
		wtypeId: Types.Weapon.Dagger,
		etypeId: Types.Equipment.Weapon,
		description: 'glossary:equipments.Dagger.description',
		params: {
			[Ids.Param.str]: 3,
			[Ids.Param.agi]: -1
		},
		price: 0,
		traits: []
	},
	{
		name: 'Casual Gloves',
		id: 6,
		emoji: '<:s:765578655153258496>',
		wtypeId: Types.Weapon.Glove,
		etypeId: Types.Equipment.Weapon,
		description: 'glossary:equipments.Casual Gloves.description',
		params: {
			[Ids.Param.str]: 3
		},
		price: 0,
		traits: []
	}
];
