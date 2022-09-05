import { Ids } from '../structures/Ids';
import { Types } from '../structures/Types';

import type { RPG } from '../structures/RPG';

export const Armors: RPG.Armor[] = [
	{
		name: 'Leather tunic',
		id: 1,
		emoji: '<:s:765578654800674847>',
		atypeId: Types.Armor['General Armor'],
		etypeId: Types.Equipment.Body,
		description: 'glossary:equipments.Leather tunic.description',
		params: {
			[Ids.Param.def]: 3,
			[Ids.Param.int]: 4,
			[Ids.Param.agi]: -1
		},
		price: 0,
		traits: []
	},
	{
		name: 'Casual Hood',
		id: 2,
		emoji: '<:s:765578655342133248>',
		atypeId: Types.Armor['General Armor'],
		etypeId: Types.Equipment.Head,
		description: 'glossary:equipments.Casual Hood.description',
		params: {
			[Ids.Param.def]: 2,
			[Ids.Param.int]: 2,
			[Ids.Param.agi]: -1
		},
		price: 0,
		traits: []
	},
	{
		name: 'Wanderer Shoes',
		id: 3,
		emoji: '<:s:765578655199920188>',
		atypeId: Types.Armor['General Armor'],
		etypeId: Types.Equipment.Shoes,
		description: 'glossary:equipments.Wanderer Shoes.description',
		params: {
			[Ids.Param.def]: 2,
			[Ids.Param.mr]: 2,
			[Ids.Param.agi]: 1
		},
		price: 0,
		traits: []
	},
	{
		name: 'Wooden Shield',
		id: 4,
		emoji: '<:s:765578611649544213>',
		atypeId: Types.Armor['General Armor'],
		etypeId: Types.Equipment.Shield,
		description: 'glossary:equipments.Wooden Shield.description',
		params: {
			[Ids.Param.def]: 3,
			[Ids.Param.agi]: -1
		},
		price: 0,
		traits: []
	},
	{
		name: 'Grass Ring',
		id: 5,
		emoji: '<:s:926067089679204353>',
		atypeId: Types.Armor['General Armor'],
		etypeId: Types.Equipment.Accessory,
		description: 'glossary:equipments.Grass Ring.description',
		params: {
			[Ids.Param.int]: 1,
			[Ids.Param.mr]: 2
		},
		price: 0,
		traits: []
	},
	{
		name: 'Seashell Necklace',
		id: 6,
		emoji: '<:s:926067089813438484>',
		atypeId: Types.Armor['General Armor'],
		etypeId: Types.Equipment.Accessory,
		description: 'glossary:equipments.Seashell Necklace.description',
		params: {
			[Ids.Param.mhp]: -5,
			[Ids.Param.mr]: 2,
			[Ids.Param.def]: -1
		},
		price: 0,
		traits: []
	}
];
