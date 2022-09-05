import type { Ids } from '../Ids';
import { RPG } from '../RPG';
import { Battler } from './Battler';

import type { Action } from './Action';

export class Mob extends Battler {
	public constructor(mobId: RPG.Mob['id'], x: number, y: number) {
		super();
		this.initialize(mobId, x, y);
	}

	public battlerHue(): number {
		return this.mob().battlerHue;
	}

	public battlerName(): string {
		return this.mob().battlerName;
	}

	public dropItemRate(): number {
		return $gameParty.hasDropItemDouble() ? 2 : 1;
	}

	public mob(): RPG.Mob {
		return $dataMobs[this._mobId];
	}

	public mobId(): number {
		return this._mobId;
	}

	public exp(): number {
		return this.mob().exp;
	}

	public friendsUnit(): Troop {
		return $gameTroop;
	}

	public gold(): number {
		return this.mob().gold;
	}

	public index(): number {
		return $gameTroop.members().indexOf(this);
	}

	public initialize(mobId: RPG.Mob['id'], x: number, y: number) {
		this.initMembers();
		this.setup(mobId, x, y);
	}

	public initMembers() {
		super.initMembers();
		this._mobId = 0;
		this._letter = '';
		this._plural = false;
		this._screenX = 0;
		this._screenY = 0;
	}

	public isActionValid(action: RPG.Mob.Action): boolean {
		return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
	}

	public isBattleMember(): boolean {
		return this.index() >= 0;
	}

	public isMob(): boolean {
		return true;
	}

	public isLetterEmpty(): boolean {
		return this._letter === '';
	}

	public isSpriteVisible(): boolean {
		return true;
	}

	public itemObject(kind: RPG.Mob.DropItemKind, dataId: RPG.BaseItem['id']): RPG.BaseItem | null {
		switch (kind) {
			case RPG.Mob.DropItemKind.Item:
				return $dataItems[dataId];
			case RPG.Mob.DropItemKind.Weapon:
				return $dataWeapons[dataId];
			case RPG.Mob.DropItemKind.Armor:
				return $dataArmors[dataId];
			default:
				return null;
		}
	}

	public makeActions() {
		super.makeActions();
		if (this.numActions() > 0) {
			const actionList = this.mob().actions.filter((a) => {
				return this.isActionValid(a);
			}, this);
			if (actionList.length > 0) {
				this.selectAllActions(actionList);
			}
		}
		this.setActionState(Battler.ActionState.Waiting);
	}

	public makeDropItems(): RPG.BaseItem[] {
		return this.mob().dropItems.reduce<RPG.BaseItem[]>((r, di) => {
			if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
				return r.concat(this.itemObject(di.kind, di.dataId)!);
			}
			return r;
		}, []);
	}

	public meetsCondition(action: RPG.Mob.Action): boolean {
		const param1 = action.conditionParam1;
		const param2 = action.conditionParam2;
		switch (action.conditionType) {
			case RPG.Mob.ActionCondition.Turn:
				return this.meetsTurnCondition(param1, param2);
			case RPG.Mob.ActionCondition.HP:
				return this.meetsHpCondition(param1, param2);
			case RPG.Mob.ActionCondition.MP:
				return this.meetsMpCondition(param1, param2);
			case RPG.Mob.ActionCondition.State:
				return this.meetsStateCondition(param1);
			case RPG.Mob.ActionCondition['Party Level']:
				return this.meetsPartyLevelCondition(param1);
			// case RPG.Mob.ActionCondition.:
			// 	return this.meetsSwitchCondition(param1);
			default:
				return true;
		}
	}

	public meetsHpCondition(param1: number, param2: number): boolean {
		return this.hpRate() >= param1 && this.hpRate() <= param2;
	}

	public meetsMpCondition(param1: number, param2: number): boolean {
		return this.mpRate() >= param1 && this.mpRate() <= param2;
	}

	public meetsPartyLevelCondition(param: number): boolean {
		return $gameParty.highestLevel() >= param;
	}

	public meetsStateCondition(param: RPG.State['id']): boolean {
		return this.isStateAffected(param);
	}

	// public meetsSwitchCondition(param): boolean {
	// 	return $gameSwitches.value(param);
	// }

	public meetsTurnCondition(param1: number, param2: number): boolean {
		const n = $gameTroop.turnCount();
		if (param2 === 0) {
			return n === param1;
		}
		return n > 0 && n >= param1 && n % param2 === param1 % param2;
	}

	public name(): string {
		return this.originalName() + (this._plural ? this._letter : '');
	}

	public opponentsUnit(): Party {
		return $gameParty;
	}

	public originalName(): string {
		return this.mob().name;
	}

	public paramBase(paramId: Ids.Param): number {
		return this.mob().params[paramId];
	}

	public performAction(action: Action) {
		super.performAction(action);
	}

	public performActionEnd() {
		super.performActionEnd();
	}

	public performActionStart(action: Action) {
		super.performActionStart(action);
		this.requestEffect('whiten');
	}

	// public performCollapse() {
	// 	super.performCollapse();
	// 	switch (this.collapseType()) {
	// 		case 0:
	// 			this.requestEffect('collapse');
	// 			SoundManager.playMobCollapse();
	// 			break;
	// 		case 1:
	// 			this.requestEffect('bossCollapse');
	// 			SoundManager.playBossCollapse1();
	// 			break;
	// 		case 2:
	// 			this.requestEffect('instantCollapse');
	// 			break;
	// 	}
	// }

	// public performDamage() {
	// 	super.performDamage();
	// 	SoundManager.playMobDamage();
	// 	this.requestEffect('blink');
	// }

	public screenX(): number {
		return this._screenX;
	}

	public screenY(): number {
		return this._screenY;
	}

	public selectAction(actionList: RPG.Mob.Action[], ratingZero: number): RPG.Mob.Action | null {
		const sum = actionList.reduce((r, a) => {
			return r + a.rating - ratingZero;
		}, 0);
		if (sum > 0) {
			let value = Math.randomInt(sum);
			for (const action of actionList) {
				value -= action.rating - ratingZero;
				if (value < 0) {
					return action;
				}
			}
		}
		return null;
	}

	public selectAllActions(actionList: RPG.Mob.Action[]) {
		const ratingMax = Math.max.apply(
			null,
			actionList.map((a) => {
				return a.rating;
			})
		);
		const ratingZero = ratingMax - 3;
		actionList = actionList.filter((a) => {
			return a.rating > ratingZero;
		});
		for (let i = 0; i < this.numActions(); i++) {
			this.action(i).setMobAction(this.selectAction(actionList, ratingZero));
		}
	}

	public setLetter(letter: string) {
		this._letter = letter;
	}

	public setPlural(plural: boolean) {
		this._plural = plural;
	}

	public setup(mobId: RPG.Mob['id'], x: number, y: number) {
		this._mobId = mobId;
		this._screenX = x;
		this._screenY = y;
		this.recoverAll();
	}

	public traitObjects(): Record<'traits', RPG.Trait[]>[] {
		return super.traitObjects().concat(this.mob());
	}

	public transform(mobId: RPG.Mob['id']) {
		const name = this.originalName();
		this._mobId = mobId;
		if (this.originalName() !== name) {
			this._letter = '';
			this._plural = false;
		}
		this.refresh();
		if (this.numActions() > 0) {
			this.makeActions();
		}
	}
}

export interface Mob {
	_mobId: number;
	_letter: string;
	_plural: boolean;
	_screenX: number;
	_screenY: number;
}
