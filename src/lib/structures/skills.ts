import type { Snowflake } from 'discord.js';

import { CLASSES, EMOJIS, RANK } from '../constants';

type levelDepends = `${number}:${number}:${number}`;
type typeDepends = `${number}:${number}`;

interface Skill {
	readonly name: string;
	readonly aliases?: string[];
	readonly emoji?: `<${'a' | ''}:${string}:${Snowflake}>` | string;
	readonly description?: string;
	/**
	 * | 0 target chính bản thân
	 * | 1 target khác bản thân
	 * | true chọn tọa độ
	 * | false không chọn tọa độ
	 */
	readonly target: 0 | 1 | true | false;
}

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

export const HUNTER_SKILLS: readonly HunterSkills[] = [
	// #region Unspecialized
	{
		name: 'Punch',
		class: CLASSES['Unspecialized'],
		emoji: EMOJIS.SKILLS.PUNCH,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Healer'],
		emoji: EMOJIS.SKILLS.JUDGE,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Healer'],
		emoji: EMOJIS.SKILLS.HEAL,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Healer'],
		emoji: EMOJIS.SKILLS.CAMOUFLAGE,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Healer'],
		emoji: EMOJIS.SKILLS.BUFF,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Mage'],
		emoji: EMOJIS.SKILLS.WATER_BALL,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Mage'],
		emoji: EMOJIS.SKILLS.FLAMESPEAR,
		target: 1,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Mage'],
		emoji: EMOJIS.SKILLS.THUNDERBOLT,
		target: 1,
		rank: RANK['E-Rank'],
		description: 'Another elemental skills use thunder to damage the enemy. Has a small chance to stun',
		levelDepends: {
			cost: '15:20:30',
			cooldown: '3:3:2',
			range: '3:4:5'
		}
	},
	{
		name: 'Immobile curse',
		class: CLASSES['Mage'],
		emoji: EMOJIS.SKILLS.IMMOBILE_CURSE,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Tanker'],
		emoji: EMOJIS.SKILLS.DOUBLE_PUNCH,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Tanker'],
		emoji: EMOJIS.SKILLS.TAUNT,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Tanker'],
		emoji: EMOJIS.SKILLS.BARRIER,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Tanker'],
		emoji: EMOJIS.SKILLS.POWERSMASH,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Fighter'],
		emoji: EMOJIS.SKILLS.SLASH,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Fighter'],
		emoji: EMOJIS.SKILLS.LUNGE,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Fighter'],
		emoji: EMOJIS.SKILLS.EVADE,
		rank: RANK['E-Rank'],
		target: false,
		description: "Enhance visual and trying to dodge enemy's attack. Dodge chance depends on your Agility and Defence/Magic Resistance.",
		levelDepends: {
			cost: '20:25:30',
			cooldown: '3:2:2'
		}
	},
	{
		name: 'Vitals',
		class: CLASSES['Fighter'],
		emoji: EMOJIS.SKILLS.WEAKSPOTS,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Assassin'],
		emoji: EMOJIS.SKILLS.STAB,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Assassin'],
		emoji: EMOJIS.SKILLS.SPRINT,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Assassin'],
		emoji: EMOJIS.SKILLS.BLOODLUST,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Assassin'],
		emoji: EMOJIS.SKILLS.DAGGER_THROW,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Ranger'],
		emoji: EMOJIS.SKILLS.SHOOT,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Ranger'],
		emoji: EMOJIS.SKILLS.MULTISHOOT,
		target: 1,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Ranger'],
		emoji: EMOJIS.SKILLS.MAGIC_ARROW,
		rank: RANK['E-Rank'],
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
		class: CLASSES['Ranger'],
		emoji: EMOJIS.SKILLS.ARROWS_RAIN,
		rank: RANK['E-Rank'],
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
];

export const MOB_SKILLS: readonly MobSkills[] = [
	{
		name: 'Poison Fang',
		description: 'Rasaka launch their fangs to poison the target enemies for 2 - 3 turns. Targeted enemies suffering magic damage every turn.',
		emoji: EMOJIS.SKILLS.POISON_FANG,
		species: 'Rasaka',
		target: 1,
		turns: '2:3',
		amount: '1:2'
	},
	{
		name: 'Chomp',
		description: `Raikan chomp on the enemy. There's a chance to slow the target down for 4 - 5 turns. Healer's Heal ${EMOJIS.SKILLS.HEAL} can remove this effect.`,
		emoji: EMOJIS.SKILLS.CHOMP,
		species: 'Raikan',
		target: 1,
		amount: '1:1',
		turns: '4:5'
	},
	{
		name: 'Bone Crunch',
		description: 'Razan bite the enemy. If the enemy HP is below 50%, they will be stunned for 1 - 2 turn.',
		emoji: EMOJIS.SKILLS.BONE_CRUNCH,
		species: 'Razan',
		target: 1,
		amount: '1:1',
		turns: '1:2'
	},
	{
		name: 'Scratch',
		description: 'Briga scratch the enemy. Inflict them with Grievous Wounds for 1 - 2 turns.',
		emoji: EMOJIS.SKILLS.SCRATCH,
		species: 'Briga',
		target: 1,
		amount: '1:1',
		turns: '1:2'
	},
	{
		name: 'Leap',
		description: 'Goblin leap on the furthest enemy.',
		emoji: EMOJIS.SKILLS.LEAP,
		species: 'Goblin',
		target: false
	},
	{
		name: 'Seismic Shove',
		description: 'Stone Golem knock the enemy forwards for 1 - 2 blocks.',
		emoji: EMOJIS.SKILLS.SEISMIC_SHOVE,
		species: 'Stone Golem',
		target: 1,
		size: '1:2',
		amount: '1:1'
	},
	{
		name: 'Evolve',
		description: 'Normal mob can evolve to a boss. They will evolve if they survive for 4 turns (alive turns + killed players (1 turn/kill)).',
		emoji: EMOJIS.SKILLS.EVOLVE,
		species: 'Normal',
		target: false
	}
];
