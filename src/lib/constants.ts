import { Collection } from 'discord.js';
import { join } from 'path';

import { EQUIPMENTS } from './structures/equipments';
import { ITEMS } from './structures/items';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export const RandomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...'];

export enum SPECIAL_CHANNELS {
	LOTTERY = '734423702443393147'
}

export const SLNumberFilter = (str: string) =>
	(str.match(/^\d+(m|k|b|t)$/i) ? true : false) || str.toLowerCase() === 'all' || str.toLowerCase() === 'half';

export const SLnumber = (str: string) => {
	const match = Number(str.split(/(m|k|b|t)$/i)[0]);
	if (str.toLowerCase().endsWith('k')) return match * 1000;
	if (str.toLowerCase().endsWith('m')) return match * 1e6;
	if (str.toLowerCase().endsWith('b')) return match * 1e9;
	return match * 1e12;
};

export const CARDS = new Collection<
	`${'A' | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K'}${'♥' | '♦' | '♣' | '♠'}`,
	`${'A' | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K'}`
>();
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
].forEach((card) => CARDS.set(card as 'A♥', card.replace(/♥|♦|♣|♠/g, '') as 'A'));

export const BYPASS_COMMANDS = ['help', 'awake', 'ping', 'jail', 'rule', 'start', 'skills-skill', 'recover'];

export const IGNORE_DONATOR_COMMANDS = ['daily', 'weekly'];

export const PING_COMMANDS = ['profile', 'inventory', 'give'];

export const PING_SUB_COMMANDS = ['party-invite'];

export const CAPTCHA_COMMANDS = ['gate', 'mine', 'chop'];

export const ISNT_FINISHED_COMMANDS = ['slots', 'dice', 'chop', 'mine', 'craft', 'blacksmith', 'open', 'trade', 'guild', 'quest', 'duel'];

export enum RANK_TITLES {
	"Yes i'm a hunter" = 1,
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

enum CLASS_EMOJIS {
	'<:Assassin:741716520920678451>',
	'<:Fighter:741716521147170836>',
	'<:Healer:741716521088188476>',
	'<:Mage:741716521109159996>',
	'<:Ranger:741716521083994255>',
	'<:Tanker:741716521365274654>',
	'<:Unspecialized:741716520949776425>'
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

enum RANK_EMOJIS {
	'<:E_:729856065168212039>' = 1,
	'<:D_:729856065285521509>',
	'<:C_:729856065486848030>',
	'<:B_:729856065143046225>',
	'<:A_:729856064962691153>',
	'<:S_:729856065088389201>',
	'<:SS1:729861742452146186><:SS2:729861742380974101>',
	'<:NL1:729861742191968339><:NL2:729861742435500073>'
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
	'vit' = 'Vitality',
	'def' = 'Defence',
	'mr' = 'Magic Resistance'
}

export const BaseStats = {
	Assassin: {
		str: 20,
		agi: 20,
		int: 5,
		vit: 5,
		def: 5,
		mr: 5
	},
	Fighter: {
		str: 20,
		def: 20,
		int: 5,
		vit: 5,
		agi: 5,
		mr: 5
	},
	Healer: {
		int: 30,
		vit: 0,
		agi: 10,
		str: 5,
		def: 10,
		mr: 5
	},
	Mage: {
		int: 40,
		vit: 5,
		str: 0,
		agi: 5,
		def: 5,
		mr: 5
	},
	Ranger: {
		str: 20,
		int: 20,
		vit: 5,
		agi: 5,
		def: 5,
		mr: 5
	},
	Tanker: {
		def: 20,
		mr: 15,
		vit: 15,
		str: 5,
		agi: 5,
		int: 0
	},
	Unspecialized: {
		str: 10,
		agi: 10,
		int: 10,
		vit: 10,
		def: 10,
		mr: 10
	}
};

export const EMOJIS = {
	LOGO: {
		SMALL: '<:sololeveling:723734142000300134><:simulator:723734142474518670>'
	},
	CLASSES: CLASS_EMOJIS,
	RANKS: RANK_EMOJIS,
	MAIN_FEATURE: {
		GUILD: '<:Guild:724541954796421151>',
		SHOP: '<:Shop:724541954150498335>',
		GAMBLING: '<:Gambling:724541954066743347>',
		PVP: '<:PvP:724541953978662972>',
		QUEST: '<:Quest:724541953961623572>',
		BLACKSMITH: '<:BlackSmith:724541953890320384>'
	},
	GATES: {
		NORMAL: 'https://media.discordapp.net/attachments/726408486526910494/730044642812231690/Gate_2.gif?width=432&height=432',
		RED: 'https://media.discordapp.net/attachments/726402638328889405/730044690682085456/Gate_2_red.gif?width=432&height=432'
	},
	MONEY: {
		MANA_CRYSTAL: '<:ManaCrystal:729523453706764388>',
		GOLDS: '<:Golds:729535888912154754>',
		MAGIC_CORE: '<:MagicCores:729601324013846650>'
	},
	STATS: {
		HP: '<:HP:741719020423741510>',
		MP: '<:MP:741719020419678258>',
		INTELLIGENCE: '<:Intelligent:741719020356501575>',
		STRENGTH: '<:str:741719020478136365>',
		DEFENCE: '<:Defence:758151671993598003>',
		MAGIC_RESISTANCE: '<:mr:741719020549439538>',
		AGILITY: '<:Agility:758152007386398750>',
		VITALITY: '<:Vitality:758152007126745131>'
	},
	TEXT: {
		LEVEL: '<:Level1:729641396226490424><:Level2:729641396662829166><:Level3:729641396687994900>',
		CLASS: '<:Class1:729652658465669161><:Class2:729652658247303169><:Class3:729652658461343804>',
		RANK: '<:Rank1:729677858976301076><:Rank2:729677859756703746><:Rank3:729677859949379726>',
		GUILD: '<:Guild1:729690301861724201><:Guild2:729690302163583077><:Guild3:729690302419435610>'
	},
	LOTTERY_TICKET: ITEMS.find((item) => item.name === 'Lottery ticket')!.emoji!,
	COOLDOWNS: '<:Cooldown3:751415280990683166>',
	READY: '<:Ready:751415280512663603>',
	ITEMS: {
		LIFE_POTION: ITEMS.find((item) => item.name === 'life potion')!.emoji!,
		MANA_POTION: ITEMS.find((item) => item.name === 'mana potion')!.emoji!,
		KEY_E: ITEMS.find((item) => item.name === 'E-rank key')!.emoji!,
		KEY_D: ITEMS.find((item) => item.name === 'D-rank key')!.emoji!,
		KEY_C: ITEMS.find((item) => item.name === 'C-rank key')!.emoji!,
		KEY_B: ITEMS.find((item) => item.name === 'B-rank key')!.emoji!,
		KEY_A: ITEMS.find((item) => item.name === 'A-rank key')!.emoji!,
		KEY_S: ITEMS.find((item) => item.name === 'S-rank key')!.emoji!,
		KEY_SS: ITEMS.find((item) => item.name === 'SS-rank key')!.emoji!,
		KEY_UPRANK: ITEMS.find((item) => item.name === 'Uprank key')!.emoji!,
		THUNDER_STONE: ITEMS.find((item) => item.name === 'thunder stone')!.emoji!,
		STATUS_RECOVERY: ITEMS.find((item) => item.name === 'Status Recovery')!.emoji!,
		RANDOM_BOX: ITEMS.find((item) => item.name === 'Random Box')!.emoji!,
		RANDOM_BLESSED_BOX: ITEMS.find((item) => item.name === 'Random Blessed Box')!.emoji!,
		RANDOM_CURSED_BOX: ITEMS.find((item) => item.name === 'Random Cursed Box')!.emoji!
	},
	EQUIPMENTS: {
		LEATHER_TUNIC: EQUIPMENTS.find((item) => item.name === 'Leather tunic')!.emoji!,
		CASUAL_HOOD: EQUIPMENTS.find((item) => item.name === 'Casual Hood')!.emoji!,
		CASUAL_GLOVES: EQUIPMENTS.find((item) => item.name === 'Casual Gloves')!.emoji!,
		WANDERER_SHOES: EQUIPMENTS.find((item) => item.name === 'Wanderer Shoes')!.emoji!,
		BROKEN_SWORD: EQUIPMENTS.find((item) => item.name === 'Broken Sword')!.emoji!,
		STICK: EQUIPMENTS.find((item) => item.name === 'Stick')!.emoji!,
		WOODEN_SHIELD: EQUIPMENTS.find((item) => item.name === 'Wooden Shield')!.emoji!,
		HUNTERS_BOW: EQUIPMENTS.find((item) => item.name === "Hunter's Bow")!.emoji!,
		HANDWRITTEN_BIBLE: EQUIPMENTS.find((item) => item.name === 'Handwritten Bible')!.emoji!,
		DAGGER: EQUIPMENTS.find((item) => item.name === 'Dagger')!.emoji!,
		GRASS_RING: EQUIPMENTS.find((item) => item.name === 'Grass Ring')!.emoji!,
		SEASHELL_NECKLACE: EQUIPMENTS.find((item) => item.name === 'Seashell Necklace')!.emoji!
	},
	SKILLS: {
		SLASH: '<:Slash:868850352500404224>',
		EVADE: '<:Evade:868850352542330920>',
		RIPOSTE: '<:Riposte:848237306262716427>',
		LUNGE: '<:Lunge:848237306590134272>',
		WEAKSPOTS: '<:Weakspots:848237306547666994>',
		PUNCH: '<:Punch:848237446226378762>',
		STATS: '<:Stats:848237446282084422>',
		WATER_BALL: '<:WaterBall:868850352500383784>',
		FLAMESPEAR: '<:Flamespear:848237391252422716>',
		IMMOBILE_CURSE: '<:ImmobileCurse:868850352479432704>',
		THUNDERBOLT: '<:Thunderbolt:848237391343910952>',
		DOUBLE_PUNCH: '<:DoublePunch:868850352466833458>',
		TAUNT: '<:Taunt:848237528103780462>',
		POWERSMASH: '<:Powersmash:848237527998529556>',
		BARRIER: '<:Barrier:848237528078090250>',
		JUDGE: '<:Judge:868850352533950484>',
		HEAL: '<:Heal:848237358763212800>',
		CAMOUFLAGE: '<:Camouflage:848237358821670952>',
		BUFF: '<:Buff:848237358897037312>',
		STAB: '<:Stab:868850352638803968>',
		SPRINT: '<:Sprint:848237264080207903>',
		BLOODLUST: '<:Bloodlust:848237264139452466>',
		DAGGER_THROW: '<:Daggerthrow:848237263866822687>',
		SHOOT: '<:Shoot:868850352496201729>',
		MULTISHOOT: '<:Multishot:848237492296744961>',
		MAGIC_ARROW: '<:Magicarrow:848237492826013736>',
		ARROWS_RAIN: '<:Arrowrain:848237492598865960>',
		POISON_FANG: '<:PoisonFang:918783195401584680>',
		CHOMP: '<:Chomp:918783195309297704>',
		BONE_CRUNCH: '<:BoneCrunch:918783195292504084>',
		SCRATCH: '<:Scratch:918783195305082911>',
		LEAP: '<:Leap:920609719020826624>',
		SEISMIC_SHOVE: '<:SeismicShove:918783195317665812>',
		EVOLVE: '<:Evolve:922355064448897024>'
	},
	UI: {
		GUIDE: '<:Guide:864020382033772554>',
		READY: '<:Ready:864020381756293121>',
		LEAVE: '<:Leave:864020382155276288>',
		PASS_TURN: '<:PassTurn:864051358159994921>',
		MOVE: '<:Move:864051358179786762>',
		FIGHT: '<:Fight:864051358067327006>',
		CHOOSE_CLASS: '<:ChooseClass:864360839796359226>',
		RULE: '<:Rule:864360839876575232>',
		HELP: '<:Help:864360839551909900>',
		RETURN: '<:Return:864360798393991178>',
		CANCEL: '<:Cancel:864360798045601895>',
		YES: '<:Yes:864360798410375179>'
	},
	MAP: {
		NORMAL: {
			A: '<:A_:864065871504867338>',
			B: '<:B_:864065871471181844>',
			C: '<:C_:864065871084257331>',
			D: '<:D_:864065871125938197>',
			E: '<:E_:864065871503687691>',
			F: '<:F_:864065871315206155>',
			G: '<:G_:864065871643017216>',
			H: '<:H_:864065871545761823>',
			I: '<:I_:864065871658876938>',
			0: ':white_square_button:',
			1: '<:1_:864066276015865877>',
			2: '<:2_:864066276485234688>',
			3: '<:3_:864066276230299668>',
			4: '<:4_:864066276204478464>',
			5: '<:5_:864066276073799711>',
			6: '<:6_:864066276200939520>',
			7: '<:7_:864066276208410664>',
			8: '<:8_:864066275931717653>',
			9: '<:9_:864066276170792961>'
		},
		RED: {
			A: '<:A_:864066359104634910>',
			B: '<:B_:864066360208392202>',
			C: '<:C_:864066360258985994>',
			D: '<:D_:864066360392286213>',
			E: '<:E_:864066360292016138>',
			F: '<:F_:864066360035639307>',
			G: '<:G_:864066360283496458>',
			H: '<:H_:864066360261738546>',
			I: '<:I_:864066360383242240>',
			0: ':white_square_button:',
			1: '<:1_:864066482203787265>',
			2: '<:2_:864066482257395755>',
			3: '<:3_:864066482195660802>',
			4: '<:4_:864066482258444329>',
			5: '<:5_:864066482430017537>',
			6: '<:6_:864066482451251200>',
			7: '<:7_:864066482493456435>',
			8: '<:8_:864066482501844992>',
			9: '<:9_:864066482563448873>'
		}
	},
	EFFECTS: {
		POISON: '<:Poison:914807899467939890>',
		MAGIC_PENETRATION: '<:MagicPenetration:914807899656683530>',
		ARMOR_PENETRATION: '<:ArmorPenetration:914807899493138442>',
		ARMOR_N_MAGIC_PENETRATION: '<:ArmorMagicPenetration:917303874291925022>',
		STUN: '<:Stun:914807899459575848>',
		SLOW: '<:Slow:914807899585380362>',
		GRIEVOUS_WOUNDS: '<:GrievousWounds:920609656269864970>',
		AIRBORNE: '<:Airborne:920609656072732682>'
	},
	MOBS: {
		BOSS_RASAKA: '<:_BluePoisonFangsRasaka:922326433957814272>',
		GREEN_RASAKA: '<:GreenRasaka:917308349077417984>',
		PURPLE_RASAKA: '<:PurpleRasaka:917308349110964264>',
		BOSS_RAIKAN: '<:_SteelFangedRaikan:922326433483882507>',
		BLUE_RAIKAN: '<:RaikanBlue:740615341591232533>',
		YELLOW_RAIKAN: '<:RaikanYellow:740615341847085148>',
		BOSS_RAZAN: '<:_BlackShadowRazan:922326433517424692>',
		PURPLE_RAZAN: '<:RazanPurple:740623388099346473>',
		RED_RAZAN: '<:RazanRed:740623388292284556>',
		BOSS_BRIGA: '<:_RazorClawBriga:922326433756491806>',
		BLUE_BRIGA: '<:RazorClawBrigaBlue:740836166206619659>',
		GRAY_BRIGA: '<:RazorClawBrigaGray:740836166286180414>',
		BOSS_GOBLIN: '<:_Goblin:922326433857142795>',
		BLUE_GOBLIN: '<:GoblinBlue:740836086506324079>',
		RED_GOBLIN: '<:GoblinRed:740836086607249439>',
		BOSS_STONE_GOLEM: '<:_StoneGolem:922326433798434856>',
		BROWN_STONE_GOLEM: '<:StoneGolemBrown:740866921779691600>',
		GREEN_STONE_GOLEM: '<:StoneGolemGreen:740866882445508629>'
	},
	GEMS: {
		TOPAZ: '<:Topaz:922699694877081621>',
		DIAMOND: '<:Diamond:922699694709309520>',
		AMETHYST: '<:Amethyst:922699694533128242>',
		EMERALD: '<:Emerald:922699694222757960>',
		RUBY: '<:Ruby:922699694675738655>',
		SAPPHIRE: '<:Sapphire:922699694591840266>',
		OPAL: '<:Opal:922699694323433493>'
	}
};
