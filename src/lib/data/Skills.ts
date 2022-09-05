import { Ids } from '../structures/Ids';
import { RPG } from '../structures/RPG';
import { Types } from '../structures/Types';

export const Skills: RPG.Skill[] = [
	{
		name: 'Punch',
		id: 101,
		emoji: '<:s:848237446226378762>',
		description: 'glossary:skills.Punch.description',
		stypeId: Types.Skill.none,
		mpCost: 0,
		scope: '3011',
		occasion: RPG.UsableItem.Occasion['In Dungeon'],
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_PHYSICAL
		},
		requiredWTypeIds: [],
		damage: {
			type: Ids.Damage['HP Damage'],
			elementId: Types.Elements['Normal Attack'],
			formula: (a, b) => a.str * 4 - b.def * 2,
			variance: 0.2,
			critical: true
		},
		effects: []
	},
	{
		name: 'Stab',
		id: 201,
		emoji: '<:s:868850352638803968>',
		description: 'glossary:skills.Stab.description',
		stypeId: Types.Skill.none,
		mpCost: 0,
		scope: '3011',
		occasion: RPG.UsableItem.Occasion['In Dungeon'],
		invocation: {
			speed: 0,
			successRate: 1,
			repeats: 1,
			hitType: RPG.UsableItem.HitType.HITTYPE_PHYSICAL
		},
		requiredWTypeIds: [],
		damage: {
			type: Ids.Damage['HP Damage'],
			elementId: Types.Elements['Normal Attack'],
			formula: (a, b) => a.str * 5 - b.def * 2,
			variance: 0.2,
			critical: true
		},
		effects: []
	}
];
