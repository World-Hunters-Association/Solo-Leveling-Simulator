import type { Snowflake } from 'discord.js';
import { EQUIPMENTS } from './equipments';

export interface Items {
	readonly name: string;
	readonly description?: string;
	readonly price: number;
	readonly sellPrice?: number;
	readonly currency: 'golds' | 'manacrystal' | 'magiccore' | 'votePoints';
	readonly type: 'potion' | 'key' | 'stone' | 'other';
	readonly category?: 'Consumables' | 'Usable keys' | 'Items' | 'Equipment';
	readonly emoji: `<${'a' | ''}:${string}:${Snowflake}>`;
	readonly weight: number;
}

export const ITEMS: Items[] = [
	{
		name: 'life potion',
		description: 'a bottle filled with blood. Yes blood!\nUse `heal` to restore your HP',
		price: 100,
		sellPrice: 70,
		currency: 'golds',
		type: 'potion',
		category: 'Consumables',
		emoji: '<:Lifepotion1000:740053804463947776>',
		weight: 1
	},
	{
		name: 'mana potion',
		description: 'a bottle filled with water. Just water!\nUse `drink` to restore your MP',
		price: 100,
		sellPrice: 70,
		currency: 'golds',
		type: 'potion',
		category: 'Consumables',
		emoji: '<:Manapotion1000:740053804480856074>',
		weight: 2
	},
	{
		name: 'E-rank key',
		price: 50,
		sellPrice: 70,
		currency: 'manacrystal',
		type: 'key',
		category: 'Usable keys',
		emoji: '<:KeyE:740054291158532178>',
		weight: 1
	},
	{
		name: 'D-rank key',
		price: 1000,
		sellPrice: 1400,
		currency: 'manacrystal',
		type: 'key',
		category: 'Usable keys',
		emoji: '<:KeyD:740054291326304408>',
		weight: 2
	},
	{
		name: 'C-rank key',
		price: 5000,
		sellPrice: 7000,
		currency: 'manacrystal',
		type: 'key',
		category: 'Usable keys',
		emoji: '<:KeyC:740054291217252363>',
		weight: 3
	},
	{
		name: 'B-rank key',
		price: 10000,
		sellPrice: 14000,
		currency: 'manacrystal',
		type: 'key',
		category: 'Usable keys',
		emoji: '<:KeyB:740054291984678966>',
		weight: 4
	},
	{
		name: 'A-rank key',
		price: 50000,
		sellPrice: 70000,
		currency: 'manacrystal',
		type: 'key',
		category: 'Usable keys',
		emoji: '<:KeyA:740054291414384770>',
		weight: 5
	},
	{
		name: 'S-rank key',
		price: 100000,
		sellPrice: 140000,
		currency: 'manacrystal',
		type: 'key',
		category: 'Usable keys',
		emoji: '<:KeyS:740054291317784639>',
		weight: 6
	},
	{
		name: 'SS-rank key',
		price: 500000,
		sellPrice: 700000,
		currency: 'manacrystal',
		type: 'key',
		category: 'Usable keys',
		weight: 7,
		emoji: '<:keySS2:740423956208812113>'
	},
	{
		name: 'Uprank key',
		price: Infinity,
		currency: 'manacrystal',
		type: 'key',
		category: 'Usable keys',
		weight: 8,
		emoji: '<:KeyUprank:740175804339585024>'
	},
	{
		name: 'thunder stone',
		description: "A stone from The Lightning Monarch's garden\nUsed to reset stats point",
		price: 40,
		currency: 'votePoints',
		type: 'stone',
		category: 'Consumables',
		weight: 3,
		emoji: '<:Thunderstone:740174046657904680>'
	},
	{
		name: 'Status Recovery',
		description: "One ability of the System. It's restore your HP, MP. It's also remove all bad effects if you have any.",
		price: Infinity,
		currency: 'magiccore',
		type: 'other',
		category: 'Consumables',
		weight: 4,
		emoji: '<:StatusRecovery:743406575405891586>'
	},
	{
		name: 'Random Blessed Box',
		description: 'As it name.',
		price: Infinity,
		currency: 'magiccore',
		type: 'other',
		category: 'Consumables',
		weight: 6,
		emoji: '<:RandomBlessedBox:748611676294611036>'
	},
	{
		name: 'Random Cursed Box',
		description: 'As it name.',
		price: Infinity,
		currency: 'magiccore',
		type: 'other',
		category: 'Consumables',
		weight: 7,
		emoji: '<:RandomCursedBox:748611676756246598>'
	},
	{
		name: 'Random Box',
		description: 'As it name.',
		price: Infinity,
		currency: 'magiccore',
		type: 'other',
		category: 'Consumables',
		weight: 5,
		emoji: '<:RandomBox:748805857587757077>'
	},
	{
		name: 'Lottery ticket',
		description: 'Used to join lottery. You can buy up to 5 tickets.',
		price: 0,
		currency: 'golds',
		category: 'Consumables',
		type: 'other',
		weight: 8,
		emoji: '<:Lotteryticket:763331798423044097>'
	},
	{
		name: 'Leather tunic',
		description: 'A tunic made of low quality leather',
		price: 500,
		sellPrice: 350,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Leather tunic')!.emoji
	},
	{
		name: 'Casual Hood',
		description: 'A hood that suits anyone',
		price: 400,
		sellPrice: 280,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Casual Hood')!.emoji
	},
	{
		name: 'Casual Gloves',
		description: 'A pair of gloves you can find at any equipment shops',
		price: 200,
		sellPrice: 140,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Casual Gloves')!.emoji
	},
	{
		name: 'Wanderer Shoes',
		description: 'A pair of shoes for those who like to move it move it',
		price: 600,
		sellPrice: 420,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Wanderer Shoes')!.emoji
	},
	{
		name: 'Broken Sword',
		description: 'I believe someone tried to use it on a Rasaka…',
		price: 1000,
		sellPrice: 700,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Broken Sword')!.emoji
	},
	{
		name: 'Stick',
		description: 'Hmm… as long as it works.',
		price: 1000,
		sellPrice: 700,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Stick')!.emoji
	},
	{
		name: 'Wooden Shield',
		description: "I don't think this is reliable. You should get a better one as soon as possible.",
		price: 1000,
		sellPrice: 700,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Wooden Shield')!.emoji
	},
	{
		name: "Hunter's Bow",
		description: "We have a bow, we have a hunter. Uh! Hunter's bow!",
		price: 1000,
		sellPrice: 700,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === "Hunter's Bow")!.emoji
	},
	{
		name: 'Handwritten Bible',
		description: 'Someone has written this during their free time.',
		price: 1000,
		sellPrice: 700,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Handwritten Bible')!.emoji
	},
	{
		name: 'Dagger',
		description: 'What? You want a fancier name?',
		price: 1000,
		sellPrice: 700,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Dagger')!.emoji
	},
	{
		name: 'Grass Ring',
		description: 'How much does youth cost?',
		price: 500,
		sellPrice: 350,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Grass Ring')!.emoji
	},
	{
		name: 'Seashell Necklace',
		description: 'A necklace that hurts your neck.',
		price: 500,
		sellPrice: 350,
		currency: 'golds',
		category: 'Equipment',
		type: 'other',
		weight: 1000,
		emoji: EQUIPMENTS.find((eq) => eq.name === 'Seashell Necklace')!.emoji
	}
];
