import { Ids } from '../structures/Ids';
import { RPG } from '../structures/RPG';

export const Items: RPG.Item[] = [
	{
		name: 'Life Potion I',
		id: 1,
		description: 'glossary:items.Life Potion I.description',
		emoji: '<:s:740053804463947776>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: 25,
		currency: 'gold',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Always,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Mana Potion I',
		id: 2,
		description: 'glossary:items.Mana Potion I.description',
		emoji: '<:s:740053804480856074>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: 25,
		currency: 'gold',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Always,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Status Recovery',
		id: 3,
		description: 'glossary:items.Status Recovery.description',
		emoji: '<:s:743406575405891586>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'magicCore',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Always,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'E-rank key',
		id: 4,
		description: 'glossary:items.E-rank key.description',
		emoji: '<:s:740054291158532178>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: 56,
		currency: 'manaCrystal',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'D-rank key',
		id: 4,
		description: 'glossary:items.D-rank key.description',
		emoji: '<:s:740054291158532178>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'manaCrystal',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'C-rank key',
		id: 5,
		description: 'glossary:items.C-rank key.description',
		emoji: '<:s:740054291158532178>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'manaCrystal',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'B-rank key',
		id: 6,
		description: 'glossary:items.B-rank key.description',
		emoji: '<:s:740054291158532178>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'manaCrystal',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'A-rank key',
		id: 7,
		description: 'glossary:items.A-rank key.description',
		emoji: '<:s:740054291158532178>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'manaCrystal',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'S-rank key',
		id: 8,
		description: 'glossary:items.S-rank key.description',
		emoji: '<:s:740054291158532178>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'manaCrystal',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'SS-rank key',
		id: 9,
		description: 'glossary:items.SS-rank key.description',
		emoji: '<:s:740054291158532178>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'manaCrystal',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Uprank key',
		id: 10,
		description: 'glossary:items.Uprank key.description',
		emoji: '<:s:740054291158532178>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'manaCrystal',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Thunder Stone',
		id: 11,
		description: 'glossary:items.Thunder Stone.description',
		emoji: '<:s:740174046657904680>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: 40,
		currency: 'votePoint',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Random Box',
		id: 12,
		description: 'glossary:items.Random Box.description',
		emoji: '<:s:748805857587757077>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'magicCore',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Random Blessed Box',
		id: 13,
		description: 'glossary:items.Random Blessed Box.description',
		emoji: '<:s:748611676294611036>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'magicCore',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Random Cursed Box',
		id: 14,
		description: 'glossary:items.Random Cursed Box.description',
		emoji: '<:s:748611676756246598>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'magicCore',
		consumable: true,
		scope: '4000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Rasaka Eye',
		id: 15,
		description: 'glossary:materials.Rasaka Eye.description',
		emoji: '<:s:749291094969155644>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Rasaka Scale',
		id: 16,
		description: 'glossary:Rasaka Scale Eye.description',
		emoji: '<:s:749291094570827817>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Rasaka Red Scale',
		id: 17,
		description: 'glossary:materials.Rasaka Red Scale.description',
		emoji: '<:s:749292242497306664>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Rasaka Poison Fang',
		id: 18,
		description: 'glossary:materials.Rasaka Poison Fang.description',
		emoji: '<:s:752077738008903681>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Raikan Fang',
		id: 19,
		description: 'glossary:Raikan Fang Eye.description',
		emoji: '<:s:749290982037782599>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Raikan Fur',
		id: 20,
		description: 'glossary:Raikan Fur Eye.description',
		emoji: '<:s:749290981601443942>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Briga Claw',
		id: 21,
		description: 'glossary:Briga Claw Eye.description',
		emoji: '<:s:749291018763108383>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Briga Fur',
		id: 22,
		description: 'glossary:Briga Fur Eye.description',
		emoji: '<:s:749291018423107675>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Razan Fang',
		id: 23,
		description: 'glossary:Razan Fang Eye.description',
		emoji: '<:s:749291136945750147>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Razan Fur',
		id: 24,
		description: 'glossary:Razan Fur Eye.description',
		emoji: '<:s:749291136975241266>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Goblin Eye',
		id: 25,
		description: 'glossary:Goblin Eye Eye.description',
		emoji: '<:s:749291059615629333>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Goblin Cloth',
		id: 26,
		description: 'glossary:Goblin Cloth Eye.description',
		emoji: '<:s:749291059657441290>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Stone Golem Skin Shard',
		id: 27,
		description: 'glossary:materials.Stone Golem Skin Shard.description',
		emoji: '<:s:749290950072729661>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	},
	{
		name: 'Stone Golem Core',
		id: 28,
		description: 'glossary:materials.Stone Golem Core.description',
		emoji: '<:s:751417103831138386>',
		itypeId: RPG.Item.ItemType['Regular Item'],
		price: Infinity,
		currency: 'gold',
		consumable: false,
		scope: '0000',
		occasion: RPG.UsableItem.Occasion.Outside,
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_CERTAIN
		},
		damage: {
			type: Ids.Damage.none
		},
		effects: []
	}
];
