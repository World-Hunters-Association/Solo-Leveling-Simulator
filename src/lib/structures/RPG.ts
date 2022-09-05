import type { Snowflake } from 'discord.js';

import type { Codes } from './Codes';
import type { Ids } from './Ids';
import type { Currencies } from './schemas';
import type { Types } from './Types';

/**
 * @see https://github.com/tonbijp/RPGMakerMZ/blob/master/Reference/RPG.md
 */
export namespace RPG {
	export interface Armor extends EquipItem {
		atypeId: Types.Armor;
	}

	export interface BaseItem {
		id: number;
		name: string;
		description: string;
		emoji: `<${'a' | ''}:s:${Snowflake}>`;
	}

	export namespace BaseItem {
		export type DataClass = 'none' | 'Item' | 'Skill' | 'Weapon' | 'Armor';
	}

	export interface BattleEventPage {
		conditions: BattleEventPage.Conditions;
		list: EventCommand[];
		span: BattleEventPage.Span;
	}

	export namespace BattleEventPage {
		export interface Conditions {
			turnEnding: boolean;
			turnValid: boolean;
			turnA: number;
			turnB: number;
			mobValid: boolean;
			mobIndex: number;
			mobHp: number;
			actorValid: boolean;
			actorId: number;
			actorHp: number;
			switchValid: boolean;
			switchId: number;
		}

		export enum Span {
			Battle,
			Turn,
			Monent
		}
	}

	export interface Class {
		id: number;
		name: string;
		expParams: [number, number, number, number];
		params: number[];
		learnings: Class.Learning[];
		traits: Trait[];
	}

	export namespace Class {
		export interface Learning {
			level: number;
			skillId: number;
		}
	}

	export interface CommonEvent {
		id: number;
		name: string;
		trigger: CommonEvent.Trigger;
		switchId: number;
		list: EventCommand[];
	}

	export namespace CommonEvent {
		export enum Trigger {
			none,
			Autorun,
			Parallel
		}
	}

	export interface Damage {
		type: Ids.Damage;
		elementId?: Types.Elements;
		/**
		 * Formula for calculation basic damage. The attacker is expressed with [a], the target with [b].
		 * @example a.str - b.def
		 */
		formula?: <
			params extends Record<
				keyof typeof Ids.Param | keyof typeof Ids.ExtraParam | keyof typeof Ids.SpecialParam | 'hp' | 'mp' | 'level',
				number
			>
		>(
			a: params,
			b: params
		) => number;
		/**
		 * Degree of variability. The value of the final damage will vary by this percentage value.
		 */
		variance?: number;
		/**
		 * Whether to enable critical hits. When enabled, critical hits will be determined based on the user's critical rate and the target's critical evasion rate.
		 */
		critical?: boolean;
	}

	export interface Effect {
		code: Codes.Effect;
		/**
		 * @Recover undefined
		 * @State State ID
		 * @Param Param ID
		 * @Other 41 - {0} | 42 - Param ID | 43 - Skill ID | 44 - Common Event ID
		 */
		dataId?: number;
		/**
		 * @Recover Percent -1 -> 1
		 * @State Percent Rate 0 -> 10
		 * @Param Turns
		 * @Other 42 - Value
		 */
		value1: number;
		/**
		 * @Recover Add Value
		 */
		value2?: number;
	}

	export interface EquipItem extends BaseItem {
		price: number;
		etypeId: Types.Equipment;
		params: Partial<Record<Ids.Param, number>>;
		traits: Trait[];
	}

	export interface Event {
		id: number;
		name: string;
		x: number;
		y: number;
		pages: EventPage[];
	}

	export interface EventCommand {
		code: number;
		indent: number;
		parameters: any[];
	}

	export interface EventPage {
		conditions: EventPage.Conditions;
		// image;
		moveType: EventPage.MoveType;
		// moveSpeed;
		// moveFrequency;
		moveRoute: MoveRoute[];
		// walkAnime;
		// stepAnime;
		directionFix: boolean;
		through: boolean;
		priorityType: EventPage.Priority;
		trigger: EventPage.Trigger;
		list: EventCommand[];
	}

	export namespace EventPage {
		export interface Conditions {
			switch1Valid: boolean;
			switch1Id: number;
			switch2Valid: boolean;
			switch2Id: number;
			variableValid: boolean;
			variableId: number;
			variableValue: number;
			selfSwitchValid: boolean;
			selfSwitchCh: number;
			itemValid: boolean;
			itemId: number;
			actorValid: boolean;
			actorId: number;
		}

		export enum MoveType {
			Fixed,
			Random,
			Approach,
			Custom
		}

		export enum Priority {
			'Below characters',
			'Same as characters',
			'Above characters'
		}

		export enum Trigger {
			'Action Button',
			'Player Touch',
			'Event Touch',
			'Autorun',
			'Parallel'
		}
	}

	export interface Hunter {
		id: Snowflake;
		name: string;
		// nickname: string;
		classId: Class['id'];
		initialLevel: number;
		// maxLevel: number;
		// characterName: string;
		// faceName: string;
		// faceIndex: string;
		// battlerName: string;
		battlerIndex: number;
		equips: EquipItem['id'][];
		profile: string;
		traits: Trait[];
	}

	export interface Item extends UsableItem {
		/**
		 * Type of the item.
		 * @KeyItem Typically related to story progression.
		 */
		itypeId: Item.ItemType;
		price: number;
		currency: keyof Currencies;
		consumable: boolean;
	}

	export namespace Item {
		export enum ItemType {
			'Regular Item' = 1,
			'Key Item',
			'Hidden Item A',
			'Hidden Item B'
		}
	}

	export interface Mob {
		name: string;
		id: number;
		emoji: `<${'a' | ''}:s:${Snowflake}>`;
		params: number[];
		exp: number;
		gold: number;
		manaCrystal: number;
		dropItems: Mob.DropItem[];
		actions: Mob.Action[];
		traits: Trait[];
	}

	export namespace Mob {
		export interface Action {
			skillId: number;
			conditionType: ActionCondition;
			conditionParam1: number;
			conditionParam2: number;
			rating: number;
		}

		export enum ActionCondition {
			none,
			Turn,
			HP,
			MP,
			State,
			'Party Level',
			Switch
		}

		export interface DropItem {
			kind: DropItemKind;
			dataId: number;
			/**
			 * Spawning probability of the drop.
			 */
			denominator: number;
		}

		export enum DropItemKind {
			none,
			Item,
			Weapon,
			Armor
		}
	}

	export interface MoveCommand {
		code: MoveCommand.Code;
		parameters: string[];
	}

	export namespace MoveCommand {
		export enum Code {
			ROUTE_END,
			ROUTE_MOVE_DOWN,
			ROUTE_MOVE_LEFT,
			ROUTE_MOVE_RIGHT,
			ROUTE_MOVE_UP,
			ROUTE_MOVE_LOWER_L,
			ROUTE_MOVE_LOWER_R,
			ROUTE_MOVE_UPPER_L,
			ROUTE_MOVE_UPPER_R,
			ROUTE_MOVE_RANDOM,
			ROUTE_MOVE_TOWARD,
			ROUTE_MOVE_AWAY,
			ROUTE_MOVE_FORWARD,
			ROUTE_MOVE_BACKWARD,
			ROUTE_JUMP,
			ROUTE_WAIT,
			ROUTE_TURN_DOWN,
			ROUTE_TURN_LEFT,
			ROUTE_TURN_RIGHT,
			ROUTE_TURN_UP,
			ROUTE_TURN_90D_R,
			ROUTE_TURN_90D_L,
			ROUTE_TURN_180D,
			ROUTE_TURN_90D_R_L,
			ROUTE_TURN_RANDOM,
			ROUTE_TURN_TOWARD,
			ROUTE_TURN_AWAY,
			ROUTE_SWITCH_ON,
			ROUTE_SWITCH_OFF,
			ROUTE_CHANGE_SPEED,
			ROUTE_CHANGE_FREQ,
			ROUTE_WALK_ANIME_ON,
			ROUTE_WALK_ANIME_OFF,
			ROUTE_STEP_ANIME_ON,
			ROUTE_STEP_ANIME_OFF,
			ROUTE_DIR_FIX_ON,
			ROUTE_DIR_FIX_OFF,
			ROUTE_THROUGH_ON,
			ROUTE_THROUGH_OFF,
			ROUTE_TRANSPARENT_ON,
			ROUTE_TRANSPARENT_OFF,
			ROUTE_CHANGE_IMAGE,
			ROUTE_CHANGE_OPACITY,
			ROUTE_CHANGE_BLEND_MODE,
			ROUTE_PLAY_SE,
			ROUTE_SCRIPT
		}
	}

	export interface MoveRoute {
		repeat: boolean;
		skippable: boolean;
		wait: boolean;
		list: MoveCommand[];
	}

	export interface Skill extends UsableItem {
		stypeId: Types.Skill;
		mpCost: number;
		requiredWTypeIds?: Types.Weapon[];
	}

	export interface State {
		id: number;
		name: string;
		emoji: `<${'a' | ''}:s:${Snowflake}>`;
		restriction: State.Restriction;
		removalCondition: {
			battleEnd?: boolean;
			restrictionOverwrite?: boolean;
			turns?: {
				timing: State.RemovalTiming;
				minTurns: number;
				maxTurns: number;
			};
			/**
			 * Remove the state at the specified probability when the target suffers some sort of damage.
			 */
			takenDamage?: number;
			/**
			 * Removes the state after walking the specified number of steps.
			 */
			walking?: number;
		};
		traits: Trait[];
	}

	export namespace State {
		export enum Restriction {
			Paralyzed,
			'Attack an Mob',
			'Attack an Ally',
			'Attack Anyone'
		}

		export enum RemovalTiming {
			none,
			'Turn End',
			'Action End'
		}
	}

	export interface Trait {
		code: Codes.Trait;
		dataId: number;
		value: number;
	}

	export interface Troop {
		id: number;
		name: string;
		members: Troop.Member[];
		pages: BattleEventPage[];
	}

	export namespace Troop {
		export interface Member {
			mobId: number;
			x: number;
			y: number;
			hidden: boolean;
		}
	}

	export interface UsableItem extends BaseItem {
		/**
		 * @example
		 * '4000' // {User}{none}{none}{0}
		 * '1011' // {Mob}{none}{Number}{1}
		 * '2120' // {Ally}{Unconditional}{All}{0}
		 * '2232' // {Ally}{Alive}{Random}{2}
		 */
		scope: UsableItem.Scope;
		occasion: UsableItem.Occasion;
		invocation: UsableItem.Invocation;
		damage: Damage;
		effects: Effect[];
	}

	export namespace UsableItem {
		export enum Occasion {
			Always,
			'In Dungeon',
			'Outside',
			'Never'
		}

		export type Scope = `${ScopeSide}${ScopeStatus}${ScopeNumberType}${number}`;

		export enum ScopeSide {
			none,
			Mob,
			Ally,
			MobAndAly,
			User
		}

		/**
		 * @Mob Always none
		 * @Ally Cannot be none
		 */
		export enum ScopeStatus {
			none,
			Unconditional,
			Alive,
			Dead
		}

		export enum ScopeNumberType {
			none,
			Number,
			All,
			Random
		}

		export function scopesDetail(scopes: Scope[]): Scope[] {
			const temp = new Set<Scope>();

			return scopes.reduce<Scope[]>((arr, scope) => {
				const [side, status, numberType, number] = scope.split('').map((s, i, a) => (i === 3 ? Number(a.slice(3).join('')) : Number(s)));

				const sides = side === ScopeSide.MobAndAly ? [ScopeSide.MobAndAly, ScopeSide.Ally, ScopeSide.Mob] : [side];

				const statuses = new Set<number>();
				(status === ScopeStatus.Unconditional || side === ScopeSide.MobAndAly
					? [ScopeStatus.Unconditional, ScopeStatus.Alive, ScopeStatus.Dead]
					: [status]
				).forEach((v) => statuses.add(v));
				if (side === ScopeSide.MobAndAly) statuses.add(ScopeStatus.none);

				const numberTypes = new Set<number>().add(numberType);
				(side === ScopeSide.MobAndAly || numberType === ScopeNumberType.All
					? [ScopeNumberType.Number, ScopeNumberType.All, ScopeNumberType.Random]
					: [numberType]
				).forEach((v) => numberTypes.add(v));

				const numbers = new Set<number>().add(number);
				if (numberType % 2 === 1) for (let i = 1; i <= number; i++) numbers.add(i);
				if (numberTypes.has(2) || numberTypes.has(0)) numbers.add(0);
				if (side === ScopeSide.MobAndAly || numberType === ScopeNumberType.All) for (let i = 1; i <= 12; i++) numbers.add(i);

				for (const sd of sides) {
					for (const st of statuses) {
						for (const nt of numberTypes) {
							for (const nm of numbers) {
								if (sd === ScopeSide.none) continue;
								if (sd === ScopeSide.Mob && (nt === ScopeNumberType.none || st !== ScopeStatus.none)) continue;
								if (sd === ScopeSide.Ally && st === ScopeStatus.none) continue;
								if (sd === ScopeSide.MobAndAly && (nt !== ScopeNumberType.All || st !== ScopeStatus.none)) continue;
								if (sd === ScopeSide.User && (nt !== ScopeNumberType.none || st !== ScopeStatus.none)) continue;
								if (nt % 2 === 0 && nm !== 0) continue;
								if (nt % 2 !== 0 && nm === 0) continue;
								temp.add(`${sd}${st}${nt}${nm}` as Scope);
							}
						}
					}
				}

				arr = Array.from(temp);
				return arr;
			}, []);
		}

		export interface Invocation {
			/**
			 * Value that is added to the character's agility when determining action order.
			 * This allows you to create actions that are powerful but take a long time to perform.
			 */
			speed: number;
			/**
			 * The probability that the use of the action succeeds.
			 */
			successRate: number;
			/**
			 * Number of times the effect is applied to the target
			 */
			repeats: number;
			/**
			 * Method to determining a hit.
			 * @HITTYPE_CERTAIN Treats a successful use of the action as a hit
			 * @HITTYPE_PHYSICAL Determines hits based on the user's hit rate and the target's evasion rate
			 * @HITTYPE_MAGICAL Determines hits based on the target's magic evasion rate
			 */
			hitType: HitType;
		}

		export enum HitType {
			HITTYPE_CERTAIN,
			HITTYPE_PHYSICAL,
			HITTYPE_MAGICAL
		}
	}

	export interface Weapon extends EquipItem {
		wtypeId: Types.Weapon;
	}
}
