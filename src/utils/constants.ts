import type { PieceContext } from '@sapphire/framework';
import { Locale } from 'discord-api-types/v9';
import { Collection, Snowflake } from 'discord.js';
import { join } from 'path';

import { Utils } from '../lib/structures/Utils';

import type { RPG } from '../lib/structures/RPG';
import type { Types } from '../lib/structures/Types';
import type { Currencies } from '../lib/structures/schemas';

export class Constants extends Utils {
	public DROPS = [
		{
			name: 'Rasaka Eye',
			emoji: '<:s:749291094969155644>',
			species: 'Rasaka',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Rasaka Scale',
			emoji: '<:s:749291094570827817>',
			species: 'Rasaka',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Rasaka Red Scale',
			emoji: '<:s:749292242497306664>',
			species: 'Rasaka',
			rank: 2,
			sellPrice: undefined
		},
		{
			name: 'Rasaka Poison Fang',
			emoji: '<:s:752077738008903681>',
			species: 'Rasaka',
			rank: 3,
			sellPrice: undefined
		},
		{
			name: 'Raikan Fang',
			emoji: '<:s:749290982037782599>',
			species: 'Raikan',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Raikan Fur',
			emoji: '<:s:749290981601443942>',
			species: 'Raikan',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Briga Claw',
			emoji: '<:s:749291018763108383>',
			species: 'Briga',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Briga Fur',
			emoji: '<:s:749291018423107675>',
			species: 'Briga',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Razan Fang',
			emoji: '<:s:749291136945750147>',
			species: 'Razan',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Razan Fur',
			emoji: '<:s:749291136975241266>',
			species: 'Razan',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Goblin Eye',
			emoji: '<:s:749291059615629333>',
			species: 'Goblin',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Goblin Cloth',
			emoji: '<:s:749291059657441290>',
			species: 'Goblin',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Stone Golem Skin Shard',
			emoji: '<:s:749290950072729661>',
			species: 'Stone Golem',
			rank: 1,
			sellPrice: 100
		},
		{
			name: 'Stone Golem Core',
			emoji: '<:s:751417103831138386>',
			species: 'Stone Golem',
			rank: 1,
			sellPrice: 100
		}
	] as const;

	public EQUIPMENTS = [
		{
			name: 'Leather tunic',
			emoji: '<:s:765578654800674847>',
			eid: '765578654800674847',
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
			emoji: '<:s:765578655342133248>',
			eid: '765578655342133248',
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
			emoji: '<:s:765578655153258496>',
			eid: '765578655153258496',
			class: 0,
			type: 'gloves',
			stats: {
				def: 1
			}
		},
		{
			name: 'Wanderer Shoes',
			emoji: '<:s:765578655199920188>',
			eid: '765578655199920188',
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
			emoji: '<:s:765578611628965889>',
			eid: '765578611628965889',
			class: 0,
			type: 'weapon',
			stats: {
				str: 3,
				agi: -1
			}
		},
		{
			name: 'Stick',
			emoji: '<:s:765578611947339797>',
			eid: '765578611947339797',
			class: 0,
			type: 'weapon',
			stats: {
				int: 3,
				agi: -1
			}
		},
		{
			name: 'Wooden Shield',
			emoji: '<:s:765578611649544213>',
			eid: '765578611649544213',
			class: 0,
			type: 'weapon',
			stats: {
				def: 3,
				agi: -1
			}
		},
		{
			name: "Hunter's Bow",
			emoji: '<:s:926067144079319080>',
			eid: '926067144079319080',
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
			emoji: '<:s:926067144293244929>',
			eid: '926067144293244929',
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
			emoji: '<:s:926067146046439464>',
			eid: '926067146046439464',
			class: 0,
			type: 'weapon',
			stats: {
				str: 3,
				agi: -1
			}
		},
		{
			name: 'Grass Ring',
			emoji: '<:s:926067089679204353>',
			eid: '926067089679204353',
			class: 0,
			type: 'ring',
			stats: {
				int: 1,
				mr: 2
			}
		},
		{
			name: 'Seashell Necklace',
			emoji: '<:s:926067089813438484>',
			eid: '926067089813438484',
			class: 0,
			type: 'necklace',
			stats: {
				vit: -1,
				mr: 2,
				def: -1
			}
		}
	] as const;

	public ITEMS = [
		{
			name: 'Life Potion I',
			description: 'a bottle filled with blood. Yes blood!\nUse `heal` to restore your HP',
			price: 100,
			sellPrice: 70,
			currency: 'gold',
			type: 'potion',
			category: 'Consumables',
			emoji: '<:s:740053804463947776>',
			weight: 1
		},
		{
			name: 'Mana Potion I',
			description: 'a bottle filled with water. Just water!\nUse `drink` to restore your MP',
			price: 100,
			sellPrice: 70,
			currency: 'gold',
			type: 'potion',
			category: 'Consumables',
			emoji: '<:s:740053804480856074>',
			weight: 2
		},
		{
			name: 'E-rank key',
			price: 50,
			sellPrice: 70,
			currency: 'manaCrystal',
			type: 'key',
			category: 'Keys',
			emoji: '<:s:740054291158532178>',
			weight: 1
		},
		{
			name: 'D-rank key',
			price: 1000,
			sellPrice: 1400,
			currency: 'manaCrystal',
			type: 'key',
			category: 'Keys',
			emoji: '<:s:740054291326304408>',
			weight: 2
		},
		{
			name: 'C-rank key',
			price: 5000,
			sellPrice: 7000,
			currency: 'manaCrystal',
			type: 'key',
			category: 'Keys',
			emoji: '<:s:740054291217252363>',
			weight: 3
		},
		{
			name: 'B-rank key',
			price: 10000,
			sellPrice: 14000,
			currency: 'manaCrystal',
			type: 'key',
			category: 'Keys',
			emoji: '<:s:740054291984678966>',
			weight: 4
		},
		{
			name: 'A-rank key',
			price: 50000,
			sellPrice: 70000,
			currency: 'manaCrystal',
			type: 'key',
			category: 'Keys',
			emoji: '<:s:740054291414384770>',
			weight: 5
		},
		{
			name: 'S-rank key',
			price: 100000,
			sellPrice: 140000,
			currency: 'manaCrystal',
			type: 'key',
			category: 'Keys',
			emoji: '<:s:740054291317784639>',
			weight: 6
		},
		{
			name: 'SS-rank key',
			price: 500000,
			sellPrice: 700000,
			currency: 'manaCrystal',
			type: 'key',
			category: 'Keys',
			weight: 7,
			emoji: '<:s:740423956208812113>'
		},
		{
			name: 'Uprank key',
			price: Infinity,
			currency: 'manaCrystal',
			type: 'key',
			category: 'Keys',
			weight: 8,
			emoji: '<:s:740175804339585024>'
		},
		{
			name: 'Thunder Stone',
			description: "A stone from The Lightning Monarch's garden\nUsed to reset stats point",
			price: 40,
			currency: 'votePoint',
			type: 'stone',
			category: 'Consumables',
			weight: 3,
			emoji: '<:s:740174046657904680>'
		},
		{
			name: 'Status Recovery',
			description: "One ability of the System. It's restore your HP, MP. It's also remove all bad effects if you have any.",
			price: Infinity,
			currency: 'magicCore',
			type: 'other',
			category: 'Consumables',
			weight: 4,
			emoji: '<:s:743406575405891586>'
		},
		{
			name: 'Random Blessed Box',
			description: 'As it name.',
			price: Infinity,
			currency: 'magicCore',
			type: 'other',
			category: 'Consumables',
			weight: 6,
			emoji: '<:s:748611676294611036>'
		},
		{
			name: 'Random Cursed Box',
			description: 'As it name.',
			price: Infinity,
			currency: 'magicCore',
			type: 'other',
			category: 'Consumables',
			weight: 7,
			emoji: '<:s:748611676756246598>'
		},
		{
			name: 'Random Box',
			description: 'As it name.',
			price: Infinity,
			currency: 'magicCore',
			type: 'other',
			category: 'Consumables',
			weight: 5,
			emoji: '<:s:748805857587757077>'
		},
		{
			name: 'Lottery ticket',
			description: 'Used to join lottery. You can buy up to 5 tickets.',
			price: Infinity,
			currency: 'gold',
			category: 'Consumables',
			type: 'other',
			weight: 8,
			emoji: '<:s:763331798423044097>'
		},
		{
			name: 'Leather tunic',
			description: 'A tunic made of low quality leather',
			price: 500,
			sellPrice: 350,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Leather tunic')!.emoji
		},
		{
			name: 'Casual Hood',
			description: 'A hood that suits anyone',
			price: 400,
			sellPrice: 280,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Casual Hood')!.emoji
		},
		{
			name: 'Casual Gloves',
			description: 'A pair of gloves you can find at any equipment shops',
			price: 200,
			sellPrice: 140,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Casual Gloves')!.emoji
		},
		{
			name: 'Wanderer Shoes',
			description: 'A pair of shoes for those who like to move it move it',
			price: 600,
			sellPrice: 420,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Wanderer Shoes')!.emoji
		},
		{
			name: 'Broken Sword',
			description: 'I believe someone tried to use it on a Rasaka…',
			price: 1000,
			sellPrice: 700,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Broken Sword')!.emoji
		},
		{
			name: 'Stick',
			description: 'Hmm… as long as it works.',
			price: 1000,
			sellPrice: 700,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Stick')!.emoji
		},
		{
			name: 'Wooden Shield',
			description: "I don't think this is reliable. You should get a better one as soon as possible.",
			price: 1000,
			sellPrice: 700,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Wooden Shield')!.emoji
		},
		{
			name: "Hunter's Bow",
			description: "We have a bow, we have a hunter. Uh! Hunter's bow!",
			price: 1000,
			sellPrice: 700,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === "Hunter's Bow")!.emoji
		},
		{
			name: 'Handwritten Bible',
			description: 'Someone has written this during their free time.',
			price: 1000,
			sellPrice: 700,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Handwritten Bible')!.emoji
		},
		{
			name: 'Dagger',
			description: 'What? You want a fancier name?',
			price: 1000,
			sellPrice: 700,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Dagger')!.emoji
		},
		{
			name: 'Grass Ring',
			description: 'How much does youth cost?',
			price: 500,
			sellPrice: 350,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Grass Ring')!.emoji
		},
		{
			name: 'Seashell Necklace',
			description: 'A necklace that hurts your neck.',
			price: 500,
			sellPrice: 350,
			currency: 'gold',
			category: 'Equipment',
			type: 'other',
			weight: 1000,
			emoji: this.EQUIPMENTS.find((eq) => eq.name === 'Seashell Necklace')!.emoji
		}
	] as const;

	public EMOJIS = {
		LOGO: {
			SMALL: '<:s:723734142000300134><:s:723734142474518670>'
		},
		CLASSES: Constants.CLASS_EMOJIS,
		RANKS: Constants.RANK_EMOJIS,
		MAIN_FEATURE: {
			GUILD: '<:s:724541954796421151>',
			SHOP: '<:s:724541954150498335>',
			GAMBLING: '<:s:724541954066743347>',
			PVP: '<:s:724541953978662972>',
			QUEST: '<:s:724541953961623572>',
			BLACKSMITH: '<:s:724541953890320384>'
		},
		GATES: {
			NORMAL: 'https://media.discordapp.net/attachments/726408486526910494/730044642812231690/Gate_2.gif?width=432&height=432',
			RED: 'https://media.discordapp.net/attachments/726402638328889405/730044690682085456/Gate_2_red.gif?width=432&height=432'
		},
		MONEY: {
			MANA_CRYSTAL: '<:s:729523453706764388>',
			GOLDS: '<:s:729535888912154754>',
			MAGIC_CORE: '<:s:729601324013846650>'
		},
		STATS: {
			HP: '<:s:741719020423741510>',
			MP: '<:s:741719020419678258>',
			INTELLIGENCE: '<:s:741719020356501575>',
			STRENGTH: '<:s:741719020478136365>',
			DEFENCE: '<:s:758151671993598003>',
			MAGIC_RESISTANCE: '<:s:741719020549439538>',
			AGILITY: '<:s:758152007386398750>',
			VITALITY: '<:s:758152007126745131>',
			LUCK: '<:s:758152007474610226>'
		},
		TEXT: {
			LEVEL: '<:s:729641396226490424><:s:729641396662829166><:s:729641396687994900>',
			CLASS: '<:s:729652658465669161><:s:729652658247303169><:s:729652658461343804>',
			RANK: '<:s:729677858976301076><:s:729677859756703746><:s:729677859949379726>',
			GUILD: '<:s:729690301861724201><:s:729690302163583077><:s:729690302419435610>'
		},
		LOTTERY_TICKET: this.ITEMS.find((item) => item.name === 'Lottery ticket')!.emoji!,
		COOLDOWNS: '<:s:751415280990683166>',
		READY: '<:s:751415280512663603>',
		ITEMS: {
			LIFE_POTION: this.ITEMS.find((item) => item.name === 'Life Potion I')!.emoji!,
			MANA_POTION: this.ITEMS.find((item) => item.name === 'Mana Potion I')!.emoji!,
			KEY_E: this.ITEMS.find((item) => item.name === 'E-rank key')!.emoji!,
			KEY_D: this.ITEMS.find((item) => item.name === 'D-rank key')!.emoji!,
			KEY_C: this.ITEMS.find((item) => item.name === 'C-rank key')!.emoji!,
			KEY_B: this.ITEMS.find((item) => item.name === 'B-rank key')!.emoji!,
			KEY_A: this.ITEMS.find((item) => item.name === 'A-rank key')!.emoji!,
			KEY_S: this.ITEMS.find((item) => item.name === 'S-rank key')!.emoji!,
			KEY_SS: this.ITEMS.find((item) => item.name === 'SS-rank key')!.emoji!,
			KEY_UPRANK: this.ITEMS.find((item) => item.name === 'Uprank key')!.emoji!,
			THUNDER_STONE: this.ITEMS.find((item) => item.name === 'Thunder Stone')!.emoji!,
			STATUS_RECOVERY: this.ITEMS.find((item) => item.name === 'Status Recovery')!.emoji!,
			RANDOM_BOX: this.ITEMS.find((item) => item.name === 'Random Box')!.emoji!,
			RANDOM_BLESSED_BOX: this.ITEMS.find((item) => item.name === 'Random Blessed Box')!.emoji!,
			RANDOM_CURSED_BOX: this.ITEMS.find((item) => item.name === 'Random Cursed Box')!.emoji!
		},
		EQUIPMENTS: {
			LEATHER_TUNIC: this.EQUIPMENTS.find((item) => item.name === 'Leather tunic')!.emoji!,
			CASUAL_HOOD: this.EQUIPMENTS.find((item) => item.name === 'Casual Hood')!.emoji!,
			CASUAL_GLOVES: this.EQUIPMENTS.find((item) => item.name === 'Casual Gloves')!.emoji!,
			WANDERER_SHOES: this.EQUIPMENTS.find((item) => item.name === 'Wanderer Shoes')!.emoji!,
			BROKEN_SWORD: this.EQUIPMENTS.find((item) => item.name === 'Broken Sword')!.emoji!,
			STICK: this.EQUIPMENTS.find((item) => item.name === 'Stick')!.emoji!,
			WOODEN_SHIELD: this.EQUIPMENTS.find((item) => item.name === 'Wooden Shield')!.emoji!,
			HUNTERS_BOW: this.EQUIPMENTS.find((item) => item.name === "Hunter's Bow")!.emoji!,
			HANDWRITTEN_BIBLE: this.EQUIPMENTS.find((item) => item.name === 'Handwritten Bible')!.emoji!,
			DAGGER: this.EQUIPMENTS.find((item) => item.name === 'Dagger')!.emoji!,
			GRASS_RING: this.EQUIPMENTS.find((item) => item.name === 'Grass Ring')!.emoji!,
			SEASHELL_NECKLACE: this.EQUIPMENTS.find((item) => item.name === 'Seashell Necklace')!.emoji!
		},
		SKILLS: {
			SLASH: '<:s:868850352500404224>',
			EVADE: '<:s:868850352542330920>',
			RIPOSTE: '<:s:848237306262716427>',
			LUNGE: '<:s:848237306590134272>',
			WEAKSPOTS: '<:s:848237306547666994>',
			PUNCH: '<:s:848237446226378762>',
			STATS: '<:s:848237446282084422>',
			WATER_BALL: '<:s:868850352500383784>',
			FLAMESPEAR: '<:s:848237391252422716>',
			IMMOBILE_CURSE: '<:s:868850352479432704>',
			THUNDERBOLT: '<:s:848237391343910952>',
			DOUBLE_PUNCH: '<:s:868850352466833458>',
			TAUNT: '<:s:848237528103780462>',
			POWERSMASH: '<:s:848237527998529556>',
			BARRIER: '<:s:848237528078090250>',
			JUDGE: '<:s:868850352533950484>',
			HEAL: '<:s:848237358763212800>',
			CAMOUFLAGE: '<:s:848237358821670952>',
			BUFF: '<:s:848237358897037312>',
			STAB: '<:s:868850352638803968>',
			SPRINT: '<:s:848237264080207903>',
			BLOODLUST: '<:s:848237264139452466>',
			DAGGER_THROW: '<:s:848237263866822687>',
			SHOOT: '<:s:868850352496201729>',
			MULTISHOOT: '<:s:848237492296744961>',
			MAGIC_ARROW: '<:s:848237492826013736>',
			ARROWS_RAIN: '<:s:848237492598865960>',
			POISON_FANG: '<:s:918783195401584680>',
			CHOMP: '<:s:918783195309297704>',
			BONE_CRUNCH: '<:s:918783195292504084>',
			SCRATCH: '<:s:918783195305082911>',
			LEAP: '<:s:920609719020826624>',
			SEISMIC_SHOVE: '<:s:918783195317665812>',
			EVOLVE: '<:s:922355064448897024>'
		},
		UI: {
			GUIDE: '<:s:864020382033772554>',
			READY: '<:s:864020381756293121>',
			LEAVE: '<:s:864020382155276288>',
			PASS_TURN: '<:s:864051358159994921>',
			MOVE: '<:s:864051358179786762>',
			FIGHT: '<:s:864051358067327006>',
			CHOOSE_CLASS: '<:s:864360839796359226>',
			RULE: '<:s:864360839876575232>',
			HELP: '<:s:864360839551909900>',
			RETURN: '<:s:864360798393991178>',
			CANCEL: '<:s:864360798045601895>',
			YES: '<:s:864360798410375179>'
		},
		MAP: {
			NORMAL: {
				A: '<:s:864065871504867338>',
				B: '<:s:864065871471181844>',
				C: '<:s:864065871084257331>',
				D: '<:s:864065871125938197>',
				E: '<:s:864065871503687691>',
				F: '<:s:864065871315206155>',
				G: '<:s:864065871643017216>',
				H: '<:s:864065871545761823>',
				I: '<:s:864065871658876938>',
				0: ':white_square_button:',
				1: '<:s:864066276015865877>',
				2: '<:s:864066276485234688>',
				3: '<:s:864066276230299668>',
				4: '<:s:864066276204478464>',
				5: '<:s:864066276073799711>',
				6: '<:s:864066276200939520>',
				7: '<:s:864066276208410664>',
				8: '<:s:864066275931717653>',
				9: '<:s:864066276170792961>'
			},
			RED: {
				A: '<:s:864066359104634910>',
				B: '<:s:864066360208392202>',
				C: '<:s:864066360258985994>',
				D: '<:s:864066360392286213>',
				E: '<:s:864066360292016138>',
				F: '<:s:864066360035639307>',
				G: '<:s:864066360283496458>',
				H: '<:s:864066360261738546>',
				I: '<:s:864066360383242240>',
				0: ':white_square_button:',
				1: '<:s:864066482203787265>',
				2: '<:s:864066482257395755>',
				3: '<:s:864066482195660802>',
				4: '<:s:864066482258444329>',
				5: '<:s:864066482430017537>',
				6: '<:s:864066482451251200>',
				7: '<:s:864066482493456435>',
				8: '<:s:864066482501844992>',
				9: '<:s:864066482563448873>'
			}
		},
		EFFECTS: {
			POISON: '<:s:914807899467939890>',
			MAGIC_PENETRATION: '<:s:914807899656683530>',
			ARMOR_PENETRATION: '<:s:914807899493138442>',
			ARMOR_N_MAGIC_PENETRATION: '<:s:917303874291925022>',
			STUN: '<:s:914807899459575848>',
			SLOW: '<:s:914807899585380362>',
			GRIEVOUS_WOUNDS: '<:s:920609656269864970>',
			AIRBORNE: '<:s:920609656072732682>'
		},
		MOBS: {
			BOSS_RASAKA: '<:s:922326433957814272>',
			GREEN_RASAKA: '<:s:917308349077417984>',
			PURPLE_RASAKA: '<:s:917308349110964264>',
			BOSS_RAIKAN: '<:s:922326433483882507>',
			BLUE_RAIKAN: '<:s:740615341591232533>',
			YELLOW_RAIKAN: '<:s:740615341847085148>',
			BOSS_RAZAN: '<:s:922326433517424692>',
			PURPLE_RAZAN: '<:s:740623388099346473>',
			RED_RAZAN: '<:s:740623388292284556>',
			BOSS_BRIGA: '<:s:922326433756491806>',
			BLUE_BRIGA: '<:s:740836166206619659>',
			GRAY_BRIGA: '<:s:740836166286180414>',
			BOSS_GOBLIN: '<:s:922326433857142795>',
			BLUE_GOBLIN: '<:s:740836086506324079>',
			RED_GOBLIN: '<:s:740836086607249439>',
			BOSS_STONE_GOLEM: '<:s:922326433798434856>',
			BROWN_STONE_GOLEM: '<:s:740866921779691600>',
			GREEN_STONE_GOLEM: '<:s:740866882445508629>'
		},
		GEMS: {
			TOPAZ: '<:s:922699694877081621>',
			DIAMOND: '<:s:922699694709309520>',
			AMETHYST: '<:s:922699694533128242>',
			EMERALD: '<:s:922699694222757960>',
			RUBY: '<:s:922699694675738655>',
			SAPPHIRE: '<:s:922699694591840266>',
			OPAL: '<:s:922699694323433493>'
		}
	} as const;

	public MOBS = [
		{
			name: "Blue Poison Fang's Rasaka",
			emoji: this.EMOJIS.MOBS.BOSS_RASAKA,
			rank: Constants.RANK['E-Rank'],
			isBoss: true,
			species: 'Rasaka',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Rasaka'),
			stats: {
				hpMax: 200,
				mpMax: 0,
				str: 40,
				int: 60,
				def: 85,
				mr: 85,
				agi: 3,
				luk: 0,
				range: 3
			}
		},
		{
			name: 'Green Rasaka',
			emoji: this.EMOJIS.MOBS.GREEN_RASAKA,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Rasaka',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Rasaka'),
			stats: {
				hpMax: 80,
				mpMax: 0,
				str: 30,
				int: 10,
				def: 30,
				mr: 30,
				agi: 2,
				luk: 0,
				range: 2
			}
		},
		{
			name: 'Purple Rasaka',
			emoji: this.EMOJIS.MOBS.PURPLE_RASAKA,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Rasaka',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Rasaka'),
			stats: {
				hpMax: 80,
				mpMax: 0,
				str: 10,
				int: 30,
				def: 30,
				mr: 30,
				agi: 2,
				luk: 0,
				range: 2
			}
		},
		{
			name: 'Steel Fanged Raikan',
			emoji: this.EMOJIS.MOBS.BOSS_RAIKAN,
			rank: Constants.RANK['E-Rank'],
			isBoss: true,
			species: 'Raikan',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Raikan'),
			stats: {
				hpMax: 200,
				mpMax: 0,
				str: 95,
				int: 10,
				def: 60,
				mr: 60,
				agi: 4,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Blue Raikan',
			emoji: this.EMOJIS.MOBS.BLUE_RAIKAN,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Raikan',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Raikan'),
			stats: {
				hpMax: 90,
				mpMax: 0,
				str: 50,
				int: 10,
				def: 10,
				mr: 10,
				agi: 3,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Yellow Raikan',
			emoji: this.EMOJIS.MOBS.YELLOW_RAIKAN,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Raikan',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Raikan'),
			stats: {
				hpMax: 100,
				mpMax: 0,
				str: 30,
				int: 10,
				def: 30,
				mr: 30,
				agi: 3,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Black Shadow Razan',
			emoji: this.EMOJIS.MOBS.BOSS_RAZAN,
			rank: Constants.RANK['E-Rank'],
			isBoss: true,
			species: 'Razan',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Razan'),
			stats: {
				hpMax: 200,
				mpMax: 0,
				str: 70,
				int: 10,
				def: 100,
				mr: 90,
				agi: 3,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Purple Razan',
			emoji: this.EMOJIS.MOBS.PURPLE_RAZAN,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Razan',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Razan'),
			stats: {
				hpMax: 90,
				mpMax: 0,
				str: 20,
				int: 10,
				def: 40,
				mr: 60,
				agi: 2,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Red Razan',
			emoji: this.EMOJIS.MOBS.RED_RAZAN,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Razan',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Razan'),
			stats: {
				hpMax: 90,
				mpMax: 0,
				str: 30,
				int: 10,
				def: 50,
				mr: 30,
				agi: 2,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Razor Claw Briga',
			emoji: this.EMOJIS.MOBS.BOSS_BRIGA,
			rank: Constants.RANK['E-Rank'],
			isBoss: true,
			species: 'Briga',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Briga'),
			stats: {
				hpMax: 200,
				mpMax: 0,
				str: 100,
				int: 10,
				def: 30,
				mr: 30,
				agi: 3,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Blue Briga',
			emoji: this.EMOJIS.MOBS.BLUE_BRIGA,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Briga',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Briga'),
			stats: {
				hpMax: 90,
				mpMax: 0,
				str: 50,
				int: 10,
				def: 10,
				mr: 10,
				agi: 3,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Gray Briga',
			emoji: this.EMOJIS.MOBS.GRAY_BRIGA,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Briga',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Briga'),
			stats: {
				hpMax: 90,
				mpMax: 0,
				str: 30,
				int: 10,
				def: 30,
				mr: 30,
				agi: 3,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Goblin',
			emoji: this.EMOJIS.MOBS.BOSS_GOBLIN,
			rank: Constants.RANK['E-Rank'],
			isBoss: true,
			species: 'Goblin',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Goblin'),
			stats: {
				hpMax: 200,
				mpMax: 0,
				str: 70,
				int: 30,
				def: 30,
				mr: 30,
				agi: 4,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Blue Goblin',
			emoji: this.EMOJIS.MOBS.BLUE_GOBLIN,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Goblin',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Goblin'),
			stats: {
				hpMax: 60,
				mpMax: 0,
				str: 50,
				int: 20,
				def: 10,
				mr: 10,
				agi: 4,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Red Goblin',
			emoji: this.EMOJIS.MOBS.RED_GOBLIN,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Goblin',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Goblin'),
			stats: {
				hpMax: 50,
				mpMax: 0,
				str: 60,
				int: 20,
				def: 10,
				mr: 10,
				agi: 4,
				luk: 0,
				range: 1
			}
		},
		{
			name: 'Stone Golem',
			emoji: this.EMOJIS.MOBS.BOSS_STONE_GOLEM,
			rank: Constants.RANK['E-Rank'],
			isBoss: true,
			species: 'Stone Golem',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Stone Golem'),
			stats: {
				hpMax: 300,
				mpMax: 0,
				str: 20,
				int: 20,
				def: 120,
				mr: 120,
				agi: 1,
				luk: 0,
				range: 2
			}
		},
		{
			name: 'Brown Stone Golem',
			emoji: this.EMOJIS.MOBS.BROWN_STONE_GOLEM,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Stone Golem',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Stone Golem'),
			stats: {
				hpMax: 150,
				mpMax: 0,
				str: 20,
				int: 10,
				def: 50,
				mr: 50,
				agi: 1,
				luk: 0,
				range: 2
			}
		},
		{
			name: 'Green Stone Golem',
			emoji: this.EMOJIS.MOBS.GREEN_STONE_GOLEM,
			rank: Constants.RANK['E-Rank'],
			isBoss: false,
			species: 'Stone Golem',
			drops: [...this.DROPS].filter((drop) => drop.species === 'Stone Golem'),
			stats: {
				hpMax: 150,
				mpMax: 0,
				str: 10,
				int: 20,
				def: 50,
				mr: 50,
				agi: 1,
				luk: 0,
				range: 2
			}
		}
	] as const;

	public HUNTER_SKILLS = [
		// #region Unspecialized
		{
			name: 'Punch',
			class: Constants.CLASSES['Unspecialized'],
			emoji: this.EMOJIS.SKILLS.PUNCH,
			rank: Constants.RANK['E-Rank'],
			target: 1,
			description: 'Throw a heavy punch to the enemy face.',
			levelDepends: {
				cost: '0:0:0',
				range: '1:1:1',
				cooldown: '1:1:1'
			}
		},
		// #endregion
		// #region Healer
		{
			name: 'Judge',
			class: Constants.CLASSES['Healer'],
			emoji: this.EMOJIS.SKILLS.JUDGE,
			rank: Constants.RANK['E-Rank'],
			description: 'As a priest, you can ask for a judge from God to the target. The result will affect your skills.',
			target: 1,
			levelDepends: {
				cost: '0:0:0',
				range: '6:7:8',
				amount: '2:3:4',
				cooldown: '1:1:1'
			}
		},
		{
			name: 'Heal',
			class: Constants.CLASSES['Healer'],
			emoji: this.EMOJIS.SKILLS.HEAL,
			rank: Constants.RANK['E-Rank'],
			target: 0,
			description:
				'You can\'t use this skill if the target hasn\'t had a Judge (the default is "Bless"). If the Judge\'s result is "Bless" this skill will heal the target otherwise will deal damage to them.',
			levelDepends: {
				cost: '25:30:50',
				range: '3:4:4',
				amount: '1:2:3',
				cooldown: '1:1:1'
			}
		},
		{
			name: 'Camouflage',
			class: Constants.CLASSES['Healer'],
			emoji: this.EMOJIS.SKILLS.CAMOUFLAGE,
			rank: Constants.RANK['E-Rank'],
			target: false,
			description: "A spell to hide the Healer's presence. Become invisible for 2 - 4 turns",
			levelDepends: {
				cost: '25:30:40',
				cooldown: '4:4:3',
				turns: '2:3:4'
			}
		},
		{
			name: 'Buff',
			class: Constants.CLASSES['Healer'],
			emoji: this.EMOJIS.SKILLS.BUFF,
			rank: Constants.RANK['E-Rank'],
			target: 0,
			description: 'If use on "Bless" target, it will increase the next damage of them. Otherwise, it will decrease the next damage of them.',
			levelDepends: {
				cost: '20:25:30',
				cooldown: '4:4:3',
				range: '3:4:5',
				amount: '1:1:2'
			}
		},
		// #endregion
		// #region Mage
		{
			name: 'Water ball',
			class: Constants.CLASSES['Mage'],
			emoji: this.EMOJIS.SKILLS.WATER_BALL,
			rank: Constants.RANK['E-Rank'],
			description: 'Compress blocks of water and throw them at the enemies.',
			target: 1,
			levelDepends: {
				cost: '15:20:25',
				cooldown: '1:1:1',
				range: '3:4:5',
				amount: '1:2:3'
			}
		},
		{
			name: 'Flame Spear',
			aliases: ['flamespear'],
			class: Constants.CLASSES['Mage'],
			emoji: this.EMOJIS.SKILLS.FLAMESPEAR,
			target: 1,
			rank: Constants.RANK['E-Rank'],
			description: 'Create spears of fire and launch them at enemies.',
			levelDepends: {
				cost: '25:30:40',
				amount: '1:2:4',
				cooldown: '3:3:2',
				range: '3:4:5'
			}
		},
		{
			name: 'Thunderbolt',
			aliases: ['thunder bolt'],
			class: Constants.CLASSES['Mage'],
			emoji: this.EMOJIS.SKILLS.THUNDERBOLT,
			target: 1,
			rank: Constants.RANK['E-Rank'],
			description: 'Another elemental skills use thunder to damage the enemy. Has a small chance to stun',
			levelDepends: {
				cost: '15:20:30',
				cooldown: '3:3:2',
				range: '3:4:5'
			}
		},
		{
			name: 'Immobile curse',
			class: Constants.CLASSES['Mage'],
			emoji: this.EMOJIS.SKILLS.IMMOBILE_CURSE,
			rank: Constants.RANK['E-Rank'],
			target: 1,
			description: 'Curse the targeted creature(s) and reduce their agility',
			levelDepends: {
				cost: '20:25:40',
				range: '4:5:6',
				amount: '1:1:2',
				cooldown: '3:3:2'
			}
		},
		// #endregion
		// #region Tanker
		{
			name: 'Double punch',
			class: Constants.CLASSES['Tanker'],
			emoji: this.EMOJIS.SKILLS.DOUBLE_PUNCH,
			rank: Constants.RANK['E-Rank'],
			description: 'Punch the enemy twice.',
			target: 1,
			levelDepends: {
				cost: '0:0:0',
				range: '1:1:1',
				cooldown: '1:1:1'
			}
		},
		{
			name: 'Taunt',
			class: Constants.CLASSES['Tanker'],
			emoji: this.EMOJIS.SKILLS.TAUNT,
			rank: Constants.RANK['E-Rank'],
			target: false,
			description: "Provoke the enemy to get their attention, they'll now target you for 3 turns",
			levelDepends: {
				cost: '15:20:35',
				cooldown: '4:4:3',
				turns: '2:2:4',
				range: '2:3:4'
			}
		},
		{
			name: 'Barrier',
			class: Constants.CLASSES['Tanker'],
			emoji: this.EMOJIS.SKILLS.BARRIER,
			rank: Constants.RANK['E-Rank'],
			target: 0,
			description: 'Protects your allies with a powerful magic barrier. The barrier effects is depends on how "tank" the Tanker is.',
			levelDepends: {
				cost: '10:15:20',
				cooldown: '4:3:2',
				range: '1:1:2',
				amount: '2:2:3',
				turns: '2:2:4'
			}
		},
		{
			name: 'Power Smash',
			class: Constants.CLASSES['Tanker'],
			emoji: this.EMOJIS.SKILLS.POWERSMASH,
			rank: Constants.RANK['E-Rank'],
			target: false,
			description: "Launch a heavy smash that breaks the enemy's bones.",
			levelDepends: {
				cost: '20:25:30',
				cooldown: '2:2:2',
				range: '1:1:1'
			}
		},
		// #endregion
		// #region Fighter
		{
			name: 'Slash',
			class: Constants.CLASSES['Fighter'],
			emoji: this.EMOJIS.SKILLS.SLASH,
			rank: Constants.RANK['E-Rank'],
			description: 'Slash the enemy',
			target: 1,
			levelDepends: {
				cost: '0:0:0',
				cooldown: '1:1:1',
				range: '1:1:1'
			}
		},
		{
			name: 'Lunge',
			class: Constants.CLASSES['Fighter'],
			emoji: this.EMOJIS.SKILLS.LUNGE,
			rank: Constants.RANK['E-Rank'],
			target: 1,
			description: "A powerful slash that aims for the enemy's head. Deal physical damage according to your STR",
			levelDepends: {
				cost: '10:15:20',
				cooldown: '2:2:2',
				range: '3:3:4'
			}
		},
		{
			name: 'Evade',
			class: Constants.CLASSES['Fighter'],
			emoji: this.EMOJIS.SKILLS.EVADE,
			rank: Constants.RANK['E-Rank'],
			target: false,
			description: "Enhance visual and trying to dodge enemy's attack. Dodge chance depends on your Agility and Defence/Magic Resistance.",
			levelDepends: {
				cost: '20:25:30',
				cooldown: '3:2:2'
			}
		},
		{
			name: 'Vitals',
			class: Constants.CLASSES['Fighter'],
			emoji: this.EMOJIS.SKILLS.WEAKSPOTS,
			rank: Constants.RANK['E-Rank'],
			target: 1,
			description: "Find the vitals of enemies. Your next attack will deal more damage with the amount of 20% target's max HP.",
			levelDepends: {
				cost: '20:25:30',
				cooldown: '3:2:1',
				amount: '1:2:3',
				range: '3:3:4'
			}
		},
		// #endregion
		// #region Assassin
		{
			name: 'Stab',
			class: Constants.CLASSES['Assassin'],
			emoji: this.EMOJIS.SKILLS.STAB,
			rank: Constants.RANK['E-Rank'],
			description: 'Stab the enemy',
			target: 1,
			levelDepends: {
				cost: '0:0:0',
				cooldown: '1:1:1',
				range: '1:1:1'
			}
		},
		{
			name: 'Sprint',
			class: Constants.CLASSES['Assassin'],
			emoji: this.EMOJIS.SKILLS.SPRINT,
			rank: Constants.RANK['E-Rank'],
			target: false,
			description: 'Apply the armor penetration effect for the next attack.',
			levelDepends: {
				cost: '10:20:30',
				cooldown: '4:3:2',
				turns: '1:1:2'
			}
		},
		{
			name: 'Bloodlust',
			class: Constants.CLASSES['Assassin'],
			emoji: this.EMOJIS.SKILLS.BLOODLUST,
			rank: Constants.RANK['E-Rank'],
			target: 1,
			description:
				'The enemy felt your immense desire to kill, making them in a state of fear - cannot use skills for 1 - 2 turns if they have less Strength than you.',
			levelDepends: {
				cost: '20:30:40',
				cooldown: '4:3:2',
				range: '2:3:4',
				turns: '1:2:2',
				amount: '1:2:2'
			}
		},
		{
			name: 'Dagger Throw',
			class: Constants.CLASSES['Assassin'],
			emoji: this.EMOJIS.SKILLS.DAGGER_THROW,
			rank: Constants.RANK['E-Rank'],
			target: 1,
			description: 'Throw a sharp dagger towards the enemy’s throat. Dealing physical damage according to your STR',
			levelDepends: {
				cost: '10:15:30',
				cooldown: '2:2:1',
				amount: '1:1:2',
				range: '3:3:5'
			}
		},
		// #endregion
		// #region Ranger
		{
			name: 'Shoot',
			class: Constants.CLASSES['Ranger'],
			emoji: this.EMOJIS.SKILLS.SHOOT,
			rank: Constants.RANK['E-Rank'],
			description: 'Shoot enemy with your bow',
			target: 1,
			levelDepends: {
				cost: '0:0:0',
				cooldown: '1:1:1',
				range: '4:5:6'
			}
		},
		{
			name: 'Multishoot',
			aliases: ['multi shoot', 'multi-shoot'],
			class: Constants.CLASSES['Ranger'],
			emoji: this.EMOJIS.SKILLS.MULTISHOOT,
			target: 1,
			rank: Constants.RANK['E-Rank'],
			description: 'Shoot multiple arrows at the enemy on the same spot. Decreases their defense by 30% for 1 - 3 turns',
			levelDepends: {
				cost: '20:25:35',
				cooldown: '3:2:1',
				turns: '1:2:3',
				range: '2:3:4'
			}
		},
		{
			name: 'Magic Arrow',
			class: Constants.CLASSES['Ranger'],
			emoji: this.EMOJIS.SKILLS.MAGIC_ARROW,
			rank: Constants.RANK['E-Rank'],
			target: 1,
			description: 'Summon a powerful arrow to shoot at the enemy. Deal magical damage according to your INT',
			levelDepends: {
				cost: '30:40:60',
				cooldown: '3:3:2',
				range: '3:4:5'
			}
		},
		{
			name: 'Arrow rain',
			class: Constants.CLASSES['Ranger'],
			emoji: this.EMOJIS.SKILLS.ARROWS_RAIN,
			rank: Constants.RANK['E-Rank'],
			target: true,
			description: 'Summon rain of arrows that deal damage to enemies from far away.',
			levelDepends: {
				cooldown: '3:2:1',
				cost: '25:35:55',
				range: '6:7:8',
				size: '1:1:2'
			}
		}
		// #endregion
	] as const;

	public MOB_SKILLS = [
		{
			name: 'Poison Fang',
			description:
				'Rasaka launch their fangs to poison the target enemies for 2 - 3 turns. Targeted enemies suffering magic damage every turn.',
			emoji: this.EMOJIS.SKILLS.POISON_FANG,
			species: 'Rasaka',
			target: 1,
			turns: '2:3',
			amount: '1:2'
		},
		{
			name: 'Chomp',
			description: `Raikan chomp on the enemy. There's a chance to slow the target down for 4 - 5 turns. Healer's Heal ${this.EMOJIS.SKILLS.HEAL} can remove this effect.`,
			emoji: this.EMOJIS.SKILLS.CHOMP,
			species: 'Raikan',
			target: 1,
			amount: '1:1',
			turns: '4:5'
		},
		{
			name: 'Bone Crunch',
			description: 'Razan bite the enemy. If the enemy HP is below 50%, they will be stunned for 1 - 2 turn.',
			emoji: this.EMOJIS.SKILLS.BONE_CRUNCH,
			species: 'Razan',
			target: 1,
			amount: '1:1',
			turns: '1:2'
		},
		{
			name: 'Scratch',
			description: 'Briga scratch the enemy. Inflict them with Grievous Wounds for 1 - 2 turns.',
			emoji: this.EMOJIS.SKILLS.SCRATCH,
			species: 'Briga',
			target: 1,
			amount: '1:1',
			turns: '1:2'
		},
		{
			name: 'Leap',
			description: 'Goblin leap on the furthest enemy.',
			emoji: this.EMOJIS.SKILLS.LEAP,
			species: 'Goblin',
			target: false
		},
		{
			name: 'Seismic Shove',
			description: 'Stone Golem knock the enemy forwards for 1 - 2 blocks.',
			emoji: this.EMOJIS.SKILLS.SEISMIC_SHOVE,
			species: 'Stone Golem',
			target: 1,
			size: '1:2',
			amount: '1:1'
		},
		{
			name: 'Evolve',
			description:
				'Normal mob can evolve to a boss. They will evolve if they survive for 4 turns (alive turns + killed players (1 turn/kill)).',
			emoji: this.EMOJIS.SKILLS.EVOLVE,
			species: 'Normal',
			target: false
		}
	] as const;

	public rootDir = join(__dirname, '..', '..');
	public srcDir = join(this.rootDir, 'src');

	public SUPPORTED_LANGUAGES = ['en-US', 'vi'] as const;
	public DISCORD_SUPPORTED_LANGUAGES = Object.values(Locale).filter((l) => this.SUPPORTED_LANGUAGES.includes(`${l}` as 'vi'));

	public CARDS = new Collection<
		`${'A' | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K'}${'♥' | '♦' | '♣' | '♠'}`,
		`${'A' | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K'}`
	>();

	public BYPASS_COMMANDS = ['help', 'awake', 'ping', 'jail', 'rule', 'start', 'skills-skill', 'recover'] as const;

	public NON_DEFERRED_COMMANDS = ['guild create'] as const;

	public IGNORE_DONATOR_COMMANDS = ['daily', 'weekly'] as const;

	public PING_COMMANDS = ['profile', 'inventory', 'give'] as const;

	public PING_SUB_COMMANDS = ['party-invite'] as const;

	public CAPTCHA_COMMANDS = ['gate', 'mine', 'chop'] as const;

	public ISNT_FINISHED_COMMANDS = ['slots', 'dice', 'chop', 'mine', 'craft', 'blacksmith', 'open', 'trade', 'guild', 'quest', 'duel'] as const;

	public BaseStats = {
		Assassin: {
			hp: 38,
			mp: 20,
			str: 14,
			def: 15,
			int: 13,
			mr: 16,
			agi: 37,
			luk: 39
		},
		Fighter: {
			hp: 54,
			mp: 14,
			str: 19,
			def: 17,
			int: 15,
			mr: 17,
			agi: 29,
			luk: 27
		},
		Healer: {
			hp: 30,
			mp: 44,
			str: 13,
			def: 14,
			int: 14,
			mr: 15,
			agi: 24,
			luk: 32
		},
		Mage: {
			hp: 30,
			mp: 44,
			str: 12,
			def: 11,
			int: 21,
			mr: 20,
			agi: 22,
			luk: 18
		},
		Ranger: {
			hp: 34,
			mp: 23,
			str: 17,
			def: 14,
			int: 15,
			mr: 16,
			agi: 33,
			luk: 31
		},
		Tanker: {
			hp: 59,
			mp: 17,
			str: 18,
			def: 18,
			int: 15,
			mr: 20,
			agi: 25,
			luk: 21
		},
		Unspecialized: {
			hp: 45,
			mp: 30,
			str: 16,
			def: 16,
			int: 16,
			mr: 16,
			agi: 32,
			luk: 32
		}
	} as const;

	public CLASSES_INFO = {
		ASSASSIN: {
			EMOJI: this.EMOJIS.CLASSES[Constants.CLASSES['Assassin']],
			BASE_STATS: this.BaseStats['Assassin']
		},
		FIGHTER: {
			EMOJI: this.EMOJIS.CLASSES[Constants.CLASSES['Fighter']],
			BASE_STATS: this.BaseStats['Fighter']
		},
		HEALER: {
			EMOJI: this.EMOJIS.CLASSES[Constants.CLASSES['Healer']],
			BASE_STATS: this.BaseStats['Healer']
		},
		MAGE: {
			EMOJI: this.EMOJIS.CLASSES[Constants.CLASSES['Mage']],
			BASE_STATS: this.BaseStats['Mage']
		},
		RANGER: {
			EMOJI: this.EMOJIS.CLASSES[Constants.CLASSES['Ranger']],
			BASE_STATS: this.BaseStats['Ranger']
		},
		TANKER: {
			EMOJI: this.EMOJIS.CLASSES[Constants.CLASSES['Tanker']],
			BASE_STATS: this.BaseStats['Tanker']
		}
	} as const;

	public COMMANDS = {
		HELP: {
			DESCRIPTION: 'Displays a list of available commands, or detailed information for a specified command/item.',
			STATISTICS: {
				GUILD: {
					ALIASES: '`guild`',
					USAGE: '`sl guild`',
					EXAMPLES: `sl guild`
				},
				INVENTORY: {
					ALIASES: '`inventory` | `inv` | `i`',
					USAGE: '`sl inventory [@hunter]`',
					EXAMPLES: `sl i @Mzato#0001`
				},
				PROFILE: {
					ALIASES: '`profile` | `p`',
					USAGE: '`sl profile [@hunter]`',
					EXAMPLES: `sl p @Mzato#0001`
				},
				TITLE: {
					ALIASES: '`title`',
					USAGE: '`sl title [id]`',
					EXAMPLES: `sl title 2`
				},
				TOP: {
					ALIASES: '`top`',
					USAGE: '`sl top [type]`',
					EXAMPLES: `sl top global rank`
				}
			},
			LEVELING: {
				DUEL: {
					ALIASES: '`duel`',
					USAGE: '`sl duel <@hunter>`',
					EXAMPLES: `sl duel @Mzato#0001`
				},
				PARTY: {
					ALIASES: '`party` | `pt`',
					USAGE: '`sl party [command]`',
					EXAMPLES: `sl pt`
				},
				GATE: {
					ALIASES: '`gate`',
					USAGE: '`sl gate <key_type>`',
					EXAMPLES: `sl gate e`
				},
				QUEST: {
					ALIASES: '`quest`',
					USAGE: '`sl quest`',
					EXAMPLES: `sl quest`
				},
				RECOVER: {
					ALIASES: '`recover`',
					USAGE: '`sl recover`',
					EXAMPLES: `sl recover`
				},
				ADD: {
					ALIASES: '`add`',
					USAGE: '`sl add <str|int|def|mr|luk|agi> <amount>`',
					EXAMPLES: `sl add def 36`
				},
				COOLDOWN: {
					ALIASES: '`cooldown` | `cd`',
					USAGE: '`sl cooldown`',
					EXAMPLES: `sl cooldown`
				},
				CONFIG: {
					ALIASES: '`config`',
					USAGE: '`sl config <stats|logs|ping> <on|off>`',
					EXAMPLES: `sl config ping on`
				},
				EQUIP: {
					ALIASES: '`equip` | `eq`',
					USAGE: '`sl equip [item_id]`',
					EXAMPLES: `sl eq nj3MH`
				},
				UNEQUIP: {
					ALIASES: '`unequip` | `uneq`',
					USAGE: '`sl unequip [item_id]`',
					EXAMPLES: `sl uneq nj3MH`
				}
			},
			ECONOMY: {
				BUY: {
					ALIASES: '`buy`',
					USAGE: '`sl buy [amount] <item_name>`',
					EXAMPLES: `sl buy kamish dagger`
				},
				GIVE: {
					ALIASES: '`give`',
					USAGE: '`sl give <amount>`',
					EXAMPLES: `sl give half`
				},
				OPEN: {
					ALIASES: '`open`',
					USAGE: '??', // '`sl open <box_name/all>`',
					EXAMPLES: '??' // `sl open exclusive`,
				},
				SELL: {
					ALIASES: '`sell`',
					USAGE: '`sl sell <item_name> [amount]`',
					EXAMPLES: `sl sell dagger`
				},
				SHOP: {
					ALIASES: '`shop`',
					USAGE: '`sl shop [type/pages]`',
					EXAMPLES: `sl shop 4`
				},
				TRADE: {
					ALIASES: '`trade`',
					USAGE: '??', // '`sl trade <@hunter> <item_name> [amount]`',
					EXAMPLES: '??' // `sl trade @Mzato#0001 kamish dagger`,
				},
				USE: {
					ALIASES: '`use`',
					USAGE: '`sl use <item_name> [amount]`',
					EXAMPLES: `sl use Mana Potion I`
				}
			},
			MORE_GOLDS: {
				VOTE: {
					ALIASES: '`vote`',
					USAGE: '`sl vote`',
					EXAMPLES: `sl vote`
				},
				DAILY: {
					ALIASES: '`daily`',
					USAGE: '`sl daily`',
					EXAMPLES: `sl daily`
				},
				WEEKLY: {
					ALIASES: '`weekly`',
					USAGE: '`sl weekly`',
					EXAMPLES: `sl weekly`
				},
				CODES: {
					ALIASES: '`codes`',
					USAGE: '`sl codes`',
					EXAMPLES: `sl codes`
				},
				REDEEM: {
					ALIASES: '`redeem`',
					USAGE: '`sl redeem <code>`',
					EXAMPLES: `sl redeem Mzato *(ye its one of my codes)*`
				},
				REFERRAL: {
					ALIASES: '`referral` | `ref`',
					USAGE: '`sl ref <code>`',
					EXAMPLES: `sl ref`
				}
			},
			WORKING: {
				CHOP: {
					ALIASES: '`chop`',
					USAGE: '??',
					EXAMPLES: '??'
				},
				MINE: {
					ALIASES: '`mine`',
					USAGE: '??',
					EXAMPLES: '??'
				},
				CRAFT: {
					ALIASES: '`craft`',
					USAGE: '??',
					EXAMPLES: '??'
				},
				BLACKSMITH: {
					ALIASES: '`blacksmith`',
					USAGE: '??',
					EXAMPLES: '??'
				}
			},
			GAMBLING: {
				LOTTERY: {
					ALIASES: '`lottery` | `lt`',
					USAGE: '`sl lottery`',
					EXAMPLES: `sl lottery`
				},
				SLOTS: {
					ALIASES: '`slots`',
					USAGE: '`sl slots <gold>`',
					EXAMPLES: `sl slots <gold>`
				},
				BLACKJACK: {
					ALIASES: '`blackjack` | `bj`',
					USAGE: '`sl blackjack <golds>`',
					EXAMPLES: `sl blackjack 12345`
				},
				COINFLIP: {
					ALIASES: '`coinflip` | `cf`',
					USAGE: '`sl coinflip <h|t|heads|tails> <golds>`',
					EXAMPLES: `sl coinflip h 12345`
				},
				DICE: {
					ALIASES: '`dice`',
					USAGE: '`sl dice <golds>`',
					EXAMPLES: `sl dice 12345`
				},
				THREECARDS: {
					ALIASES: '`threecards` | `tc`',
					USAGE: '`sl threecards <golds>`',
					EXAMPLES: `sl threecards 12345`
				}
			},
			OTHERS: {
				INFO: {
					ALIASES: '`info`',
					USAGE: '`sl info`',
					EXAMPLES: `sl info`
				},
				PING: {
					ALIASES: '`ping`',
					USAGE: '`sl ping`',
					EXAMPLES: `sl ping`
				},
				INVITE: {
					ALIASES: '`invite`',
					USAGE: '`sl invite`',
					EXAMPLES: `sl invite`
				},
				MONEY: {
					ALIASES: '`money` | `wallet` | `bal` | `balance`',
					USAGE: '`sl money`',
					EXAMPLES: `sl money`
				},
				PROGRESS: {
					ALIASES: '`progress` | `pr`',
					USAGE: '`sl progress`',
					EXAMPLES: `sl progress`
				},
				STATS: {
					ALIASES: '`stats` | `stat`',
					USAGE: '`sl stats`',
					EXAMPLES: `sl stats`
				},
				GUIDE: {
					ALIASES: '`guide` | `start`',
					USAGE: '`sl guide`',
					EXAMPLES: `sl guide`
				},
				DONATOR: {
					ALIASES: '`donator` | `donor`',
					USAGE: '`sl donator`',
					EXAMPLES: `sl donator`
				}
			},
			TERMS: {
				STRENGTH: {
					ALIASES: '`str` | `strength`',
					EMOJI: this.EMOJIS.STATS.STRENGTH,
					EMBED: {
						description: 'Increase physical damage output.'
					}
				},
				AGILITY: {
					ALIASES: '`agi` | `agility`',
					EMOJI: this.EMOJIS.STATS.AGILITY,
					EMBED: {
						description: 'Increase move range.\n\n**Note**: 5/35/80/140/215 Agility give you 1/2/3/4/5 move range.'
					}
				},
				INTELLIGENCE: {
					ALIASES: '`int` | `intelligence`',
					EMOJI: this.EMOJIS.STATS.INTELLIGENCE,
					EMBED: {
						description: 'Increase magic damage output and your MP.\n\n**Rate**: 2 INT = 1 MP.'
					}
				},
				// VITALITY: {
				// 	ALIASES: '`vit` | `vitality`',
				// 	EMOJI: this.EMOJIS.STATS.VITALITY,
				// 	EMBED: {
				// 		description: 'Increase your HP.\n\n**Rate**: 1 VIT = 3 HP.'
				// 	}
				// },
				LUCK: {
					ALIASES: '`luk` | `luck`',
					EMOJI: this.EMOJIS.STATS.LUCK,
					EMBED: {
						description:
							'This controls if you will contract a state or not. The higher your luck, the lower chance you have of getting a certain state, such as poison.'
					}
				},
				DEFENSE: {
					ALIASES: '`def` | `defence`',
					EMOJI: this.EMOJIS.STATS.DEFENCE,
					EMBED: {
						description: 'Increase your physical defense.'
					}
				},
				'MAGIC RESISTANCE': {
					ALIASES: '`mr` | `magic resistance`',
					EMOJI: this.EMOJIS.STATS['MAGIC_RESISTANCE'],
					EMBED: {
						description: 'Increase your magic defense.'
					}
				},
				SLOW: {
					EMOJI: this.EMOJIS.EFFECTS.SLOW,
					EMBED: {
						description: 'Reduces the move range of target by 1.'
					}
				},
				STUN: {
					EMOJI: this.EMOJIS.EFFECTS.STUN,
					EMBED: {
						description: 'Stuns the target. The target cannot attack, move or using potions.'
					}
				},
				'GRIEVOUS WOUNDS': {
					EMOJI: this.EMOJIS.EFFECTS['GRIEVOUS_WOUNDS'],
					EMBED: {
						description: 'Reduce healing HP effect by 50%.'
					}
				},
				DONATE: {
					EMBED: {
						description: `Donate via`,
						image: { url: 'https://cdn.discordapp.com/attachments/736792355931422801/920735252119453706/unknown.png' }
					}
				},
				'Hunter Slayer': {
					EMBED: {
						description: `The more hunters you kill, the less EXP you can earn.`
					}
				}
			}
		}
	} as const;

	public constructor(context: PieceContext) {
		super(context);

		[
			'A♥',
			'A♦',
			'A♣',
			'A♠',
			'2♥',
			'2♦',
			'2♣',
			'2♠',
			'3♥',
			'3♦',
			'3♣',
			'3♠',
			'4♥',
			'4♦',
			'4♣',
			'4♠',
			'5♥',
			'5♦',
			'5♣',
			'5♠',
			'6♥',
			'6♦',
			'6♣',
			'6♠',
			'7♥',
			'7♦',
			'7♣',
			'7♠',
			'8♥',
			'8♦',
			'8♣',
			'8♠',
			'9♥',
			'9♦',
			'9♣',
			'9♠',
			'10♥',
			'10♦',
			'10♣',
			'10♠',
			'J♥',
			'J♦',
			'J♣',
			'J♠',
			'Q♥',
			'Q♦',
			'Q♣',
			'Q♠',
			'K♥',
			'K♦',
			'K♣',
			'K♠'
		].forEach((card) => this.CARDS.set(card as 'A♥', card.replace(/♥|♦|♣|♠/g, '') as 'A'));
	}
}

export namespace Constants {
	export interface Drops {
		readonly name: string;
		readonly sellPrice: number | undefined;
		readonly species: string;
		readonly emoji: `<${'a' | ''}:${string}:${Snowflake}>`;
		readonly rank: 1 | 2 | 3 | 4 | 5 | 6 | 7;
	}

	export interface Equipments {
		readonly name: string;
		readonly emoji: `<${'a' | ''}:${string}:${Snowflake}>`;
		readonly eid: Snowflake;
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
			// vit?: number;
			luk?: number;
			agi?: number;
		};
	}

	export interface Items {
		readonly name: string;
		readonly description?: string;
		readonly price: number;
		readonly sellPrice?: number;
		readonly currency: keyof Currencies;
		readonly type: 'potion' | 'key' | 'stone' | 'other';
		readonly category?: 'Consumables' | 'Keys' | 'Items' | 'Equipment';
		readonly emoji: `<${'a' | ''}:${string}:${Snowflake}>`;
		readonly weight: number;
	}

	export interface Mobs {
		readonly name: string;
		readonly emoji: `<${'a' | ''}:${string}:${Snowflake}>` | string;
		readonly rank: RANK;
		readonly isBoss: boolean;
		readonly species: string;
		readonly drops?: Drops[];
		readonly stats: {
			readonly hpMax: number;
			readonly mpMax: number;
			readonly str: number;
			readonly def: number;
			readonly int: number;
			readonly mr: number;
			readonly agi: number;
			readonly luk: number;
			readonly range: number;
		};
	}

	type levelDepends = `${number}:${number}:${number}`;
	type typeDepends = `${number}:${number}`;

	export interface Skill {
		readonly id: number;
		readonly name: string;
		readonly description: string;
		readonly emoji?: `<${'a' | ''}:s:${Snowflake}>` | string;
		readonly type?: Types.Skill;
		readonly mpCost: number;
		readonly scope: RPG.UsableItem.Scope;
		readonly invocation: RPG.UsableItem.Invocation;
		readonly damage?: RPG.Damage;
		readonly effects?: RPG.Effect[];
		readonly requiredWeaponType?: string[];
	}

	// interface Action<condition = 'Always' | 'Turn' | 'HP' | 'MP' | 'State' | 'Party Level'> {
	// 	skill: Skill['name'];
	// 	/**
	// 	 * Priority of the action. Of all actions meeting the conditions, the one with the highest rating will
	// 	 * be the standard, and the one within 2 rating points of the standard will be used. Actions 1
	// 	 * rating point away will be used 2/3 of the time and those 2 rating points away will be used 1/3
	// 	 * of the time.
	// 	 */
	// 	Rating: number;
	// 	/**
	// 	 * Conditions for possible actions
	// 	 * @Always Possible as long as the specified action can be performed.
	// 	 * @Turn Possible as long as the specified turn has beed surpassed. Specifies the turn count with A + B * X.
	// 	 * @Turn_Example A = 1 and B = 3, the condition will be met at turn 1, 4, 7, and so on.
	// 	 * @HP_MP Possible when the HP/MP of this Mob is in the specified range.
	// 	 * @State Possible when this Mob is in the specified State
	// 	 * @PartyLevel Possible when the party's highest level is equal to, or exceeds the specified number.
	// 	 */
	// 	condition?: condition extends 'Always'
	// 		? undefined
	// 		: condition extends 'Turn'
	// 		? Record<'a' | 'b', number>
	// 		: condition extends 'HP'
	// 		? Record<'min' | 'max', number>
	// 		: condition extends 'MP'
	// 		? Record<'min' | 'max', number>
	// 		: condition extends 'State'
	// 		? State['name']
	// 		: condition extends 'Party Level'
	// 		? number
	// 		: never;
	// }

	export interface HunterSkills extends Skill {
		readonly class: CLASSES;
		readonly rank: RANK;
		readonly levelDepends: {
			/** sô lượng mp tốn trong 1 lần sử dụng */
			readonly cost: levelDepends;
			/** tầm sử dụng */
			readonly range?: levelDepends;
			/** bán kính của skill */
			readonly size?: levelDepends;
			/** số mục tiêu */
			readonly amount?: levelDepends;
			/** thời gian tồn tại */
			readonly turns?: levelDepends;
			/** E.g.: 1:1:1 cách 1 turn mới hồi */
			readonly cooldown?: levelDepends;
			/** số lần sử dụng skill để lên level */
			readonly exp?: levelDepends;
		};
	}

	export interface MobSkills extends Skill {
		readonly species: string;
		/** số mục tiêu */
		readonly amount?: typeDepends;
		/** bán kính của skill */
		readonly size?: typeDepends;
		/** thời gian tồn tại */
		readonly turns?: typeDepends;
	}

	export enum RANK_TITLES {
		"Yes, I'm a Hunter" = 1,
		"I'm better now!",
		'???',
		'????',
		'ELITE HUNTER',
		'??????',
		'???????',
		'????????'
	}

	export enum CLASSES {
		Assassin,
		Fighter,
		Healer,
		Mage,
		Ranger,
		Tanker,
		Unspecialized
	}

	export enum CLASS_EMOJIS {
		'<:s:741716520920678451>',
		'<:s:741716521147170836>',
		'<:s:741716521088188476>',
		'<:s:741716521109159996>',
		'<:s:741716521083994255>',
		'<:s:741716521365274654>',
		'<:s:741716520949776425>'
	}

	export enum RANK {
		'E-Rank' = 1,
		'D-Rank',
		'C-Rank',
		'B-Rank',
		'A-Rank',
		'S-Rank',
		'SS-Rank',
		'National Level'
	}

	export enum RANK_EMOJIS {
		'<:s:729856065168212039>' = 1,
		'<:s:729856065285521509>',
		'<:s:729856065486848030>',
		'<:s:729856065143046225>',
		'<:s:729856064962691153>',
		'<:s:729856065088389201>',
		'<:s:729861742452146186><:s:729861742380974101>',
		'<:s:729861742191968339><:s:729861742435500073>'
	}

	export enum KEYS {
		'e' = 1,
		'd',
		'c',
		'b',
		'a',
		's',
		'ss',
		'uprank'
	}

	export enum GEMS {
		TOPAZ,
		SAPPHIRE,
		RUBY,
		EMERALD,
		DIAMOND,
		AMETHYST,
		OPAL
	}

	export enum STATS {
		'str' = 'Strength',
		'agi' = 'Agility',
		'int' = 'Intelligence',
		// 'vit' = 'Vitality',
		'luk' = 'Luck',
		'def' = 'Defence',
		'mr' = 'Magic Resistance'
	}
}

declare module '../lib/structures/UtilsStore' {
	interface UtilsStore {
		get(name: 'constants'): Constants;
	}
}
