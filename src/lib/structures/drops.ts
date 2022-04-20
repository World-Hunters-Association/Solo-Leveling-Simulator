import type { Snowflake } from 'discord.js';

export interface Drops {
	readonly name: string;
	readonly sellPrice?: number;
	readonly species: string;
	readonly emoji: `<${'a' | ''}:${string}:${Snowflake}>`;
	readonly rank: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export const DROPS: Drops[] = [
	{
		name: "Rasaka's Eye",
		emoji: '<:RasakasEye:749291094969155644>',
		species: 'Rasaka',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Rasaka's Scale",
		emoji: '<:RasakasScale:749291094570827817>',
		species: 'Rasaka',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Rasaka's Red Scale",
		emoji: '<:RasakasRedScale:749292242497306664>',
		species: 'Rasaka',
		rank: 2
	},
	{
		name: "Rasaka's Poison Fang",
		emoji: '<:RasakasPoisonFang:752077738008903681>',
		species: 'Rasaka',
		rank: 3
	},
	{
		name: "Raikan's Fang",
		emoji: '<:RaikansSteelFang:749290982037782599>',
		species: 'Raikan',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Raikan's Fur",
		emoji: '<:RaikansFur:749290981601443942>',
		species: 'Raikan',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Briga's Claw",
		emoji: '<:BrigasClaw:749291018763108383>',
		species: 'Briga',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Briga's Fur",
		emoji: '<:BrigasFur:749291018423107675>',
		species: 'Briga',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Razan's Fang",
		emoji: '<:RazansFang:749291136945750147>',
		species: 'Razan',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Razan's Fur",
		emoji: '<:RazansFur:749291136975241266>',
		species: 'Razan',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Goblin's Eye",
		emoji: '<:Goblinseye:749291059615629333>',
		species: 'Goblin',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Goblin's Cloth",
		emoji: '<:GoblinsCloth:749291059657441290>',
		species: 'Goblin',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Stone Golem's Skin Shard",
		emoji: '<:StoneGolemsSkin:749290950072729661>',
		species: 'Stone Golem',
		rank: 1,
		sellPrice: 100
	},
	{
		name: "Stone Golem's Core",
		emoji: '<:StoneGolem_sCore:751417103831138386>',
		species: 'Stone Golem',
		rank: 1,
		sellPrice: 100
	}
];
