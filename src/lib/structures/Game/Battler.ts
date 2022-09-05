import { DataManager } from 'discord.js';

import { BattlerBase } from './BattlerBase';

import type { Ids } from '../Ids';
import type { RPG } from '../RPG';
import { Action } from './Action';
import { ActionResult } from './ActionResult';

export abstract class Battler extends BattlerBase {
	public constructor() {
		super();
	}

	public action(index: number): Action {
		return this._actions[index];
	}

	public addBuff(paramId: Ids.Param, turns: number): void {
		if (this.isAlive()) {
			this.increaseBuff(paramId);
			if (this.isBuffAffected(paramId)) {
				this.overwriteBuffTurns(paramId, turns);
			}
			this._result.pushAddedBuff(paramId);
			this.refresh();
		}
	}

	public addDebuff(paramId: Ids.Param, turns: number): void {
		if (this.isAlive()) {
			this.decreaseBuff(paramId);
			if (this.isDebuffAffected(paramId)) {
				this.overwriteBuffTurns(paramId, turns);
			}
			this._result.pushAddedDebuff(paramId);
			this.refresh();
		}
	}

	public addState(stateId: RPG.State['id']): void {
		if (this.isStateAddable(stateId)) {
			if (!this.isStateAffected(stateId)) {
				this.addNewState(stateId);
				this.refresh();
			}
			this.resetStateCounts(stateId);
			this._result.pushAddedState(stateId);
		}
	}

	// public applyTpbPenalty(): void

	// public cancelMotionRefresh(): void

	// public canInput(): boolean

	// public chargeTpByDamage(damageRate: number): void {
	// 	const value = Math.floor(50 * damageRate * this.tcr);
	// 	this.gainSilentTp(value);
	// }

	public clearActions(): void {
		this._actions = [];
	}

	public clearDamagePopup(): void {
		this._damagePopup = false;
	}

	// public clearEffect(): void {
	// 	delete this._effectType;
	// }

	public clearMotion(): void {
		this._motionType = '';
		this._motionRefresh = false;
	}

	public clearResult(): void {
		this._result.clear();
	}

	// public clearTp(): void {
	// 	this.setTp(0);
	// }

	// public clearTpbChargeTime(): void

	public clearWeaponAnimation(): void {
		this._weaponImageId = 0;
	}

	public consumeItem(item: RPG.UsableItem): void {
		$gameParty.consumeItem(item);
	}

	public currentAction(): Action {
		return this._actions[0];
	}

	public deselect(): void {
		this._selected = false;
	}

	public effectType(): string {
		return this._effectType;
	}

	public escape(): void {
		if ($gameParty.inBattle()) {
			this.hide();
		}
		this.clearActions();
		this.clearStates();
		// SoundManager.playEscape();
	}

	// public finishTpbCharge(): void

	public forceAction(skillId: number, targetIndex: number): void {
		this.clearActions();
		const action = new Action(this, true);
		action.setSkill(skillId);
		if (targetIndex === -2) {
			action.setTarget(this._lastTargetIndex);
		} else if (targetIndex === -1) {
			action.decideRandomTarget();
		} else {
			action.setTarget(targetIndex);
		}
		this._actions.push(action);
	}

	public gainHp(value: number): void {
		this._result.hpDamage = -value;
		this._result.hpAffected = true;
		this.setHp(this.hp + value);
	}

	// public gainSilentTp(value: number): void {
	// 	this.setTp(this.tp + value);
	// }

	public gainMp(value: number): void {
		this._result.mpDamage = -value;
		this.setMp(this.mp + value);
	}

	public initMembers(): void {
		super.initMembers();
		this._actions = [];
		this._speed = 0;
		this._result = new ActionResult();
		this._actionState = Battler.ActionState[''];
		this._lastTargetIndex = 0;
		// this._animations = [];
		this._damagePopup = false;
		this._effectType = '';
		this._motionType = '';
		this._weaponImageId = 0;
		this._motionRefresh = false;
		this._selected = false;
	}

	// public initTp(): void {
	// 	this.setTp(Math.randomInt(25));
	// }

	// public initTpbChargeTime(advantageous: boolean): void

	// public initTpbTurn(): void

	public isActing(): boolean {
		return this._actionState === Battler.ActionState.Acting;
	}

	public isChanting(): boolean {
		if (this.isWaiting()) {
			return this._actions.some((action) => {
				return action.isMagicSkill();
			});
		}
		return false;
	}

	public isDamagePopupRequested(): boolean {
		return this._damagePopup;
	}

	public isEffectRequested(): boolean {
		return Boolean(this._effectType);
	}

	public isGuardWaiting(): boolean {
		if (this.isWaiting()) {
			return this._actions.some((action) => {
				return action.isGuard();
			});
		}
		return false;
	}

	public isInputting(): boolean {
		return this._actionState === Battler.ActionState.Inputting;
	}

	public isMotionRefreshRequested(): boolean {
		return this._motionRefresh;
	}

	public isMotionRequested(): boolean {
		return Boolean(this._motionType);
	}

	public isSelected(): boolean {
		return this._selected;
	}

	public isStateAddable(stateId: RPG.State['id']): boolean {
		return (
			this.isAlive() &&
			$dataStates[stateId] &&
			!this.isStateResist(stateId) &&
			!this._result.isStateRemoved(stateId) &&
			!this.isStateRestrict(stateId)
		);
	}

	public isStateRestrict(stateId: RPG.State['id']): boolean {
		return $dataStates[stateId].removeByRestriction && this.isRestricted();
	}

	// public isTpbReady(): boolean

	// public isTpbCharged(): boolean

	// public isTpbTurnEnd(): boolean

	// public isTpbTimeout(): boolean

	public isUndecided(): boolean {
		return this._actionState === Battler.ActionState.Undecided;
	}

	public isWaiting(): boolean {
		return this._actionState === Battler.ActionState.Waiting;
	}

	public isWeaponAnimationRequested(): boolean {
		return this._weaponImageId > 0;
	}

	public makeActions(): void {
		this.clearActions();
		if (this.canMove()) {
			const actionTimes = this.makeActionTimes();
			this._actions = [];
			for (let i = 0; i < actionTimes; i++) {
				this._actions.push(new Action(this));
			}
		}
	}

	public makeActionTimes(): number {
		return this.actionPlusSet().reduce((r, p) => {
			return Math.random() < p ? r + 1 : r;
		}, 1);
	}

	public makeSpeed(): void {
		this._speed =
			Math.min.apply(
				null,
				this._actions.map((action) => {
					return action.speed();
				})
			) || 0;
	}

	// public gainTp(value: number): void {
	// 	this._result.tpDamage = -value;
	// 	this.setTp(this.tp + value);
	// }

	// public makeTpbActions(): void

	public maxSlipDamage(): number {
		return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
	}

	public motionType(): string {
		return this._motionType;
	}

	public numActions(): number {
		return this._actions.length;
	}

	public onAllActionsEnd(): void {
		this.clearResult();
		this.removeStatesAuto(1);
		this.removeBuffsAuto();
	}

	public onBattleEnd(): void {
		this.clearResult();
		this.removeBattleStates();
		this.removeAllBuffs();
		this.clearActions();
		// if (!this.isPreserveTp()) {
		// 	this.clearTp();
		// }
		this.appear();
	}

	public onBattleStart(_advantageous = false): void {
		this.setActionState(Battler.ActionState.Undecided);
		this.clearMotion();
		// if (!this.isPreserveTp()) {
		// 	this.initTp();
		// }
	}

	public onDamage(_value: number): void {
		this.removeStatesByDamage();
		// this.chargeTpByDamage(value / this.mhp);
	}

	public onRestrict(): void {
		super.onRestrict();
		this.clearActions();
		this.states().forEach((state) => {
			if (state.removeByRestriction) {
				this.removeState(state.id);
			}
		}, this);
	}

	// public onTpbCharged(): void

	// public onTpbTimeout(): void

	public onTurnEnd(): void {
		this.clearResult();
		this.regenerateAll();
		if (!BattleManager.isForcedTurn()) {
			this.updateStateTurns();
			this.updateBuffTurns();
		}
		this.removeStatesAuto(2);
	}

	public performAction(_action: Action): void {}

	public performActionEnd(): void {
		this.setActionState(Battler.ActionState.Done);
	}

	public performActionStart(action: Action): void {
		if (!action.isGuard()) {
			this.setActionState(Battler.ActionState.Acting);
		}
	}

	// public performCollapse(): void {}

	// public performCounter(): void {
	// 	SoundManager.playEvasion();
	// }

	// public performDamage(): void {}

	// public performEvasion(): void {
	// 	SoundManager.playEvasion();
	// }

	// public performMagicEvasion(): void {
	// 	SoundManager.playMagicEvasion();
	// }

	// public performRecovery(): void {
	// 	SoundManager.playRecovery();
	// }

	// public performReflection(): void {
	// 	SoundManager.playReflection();
	// }

	// public performSubstitute(target: Battler): void {}

	public refresh(): void {
		super.refresh();
		if (this.hp === 0) {
			this.addState(this.deathStateId());
		} else {
			this.removeState(this.deathStateId());
		}
	}

	public regenerateAll(): void {
		if (this.isAlive()) {
			this.regenerateHp();
			this.regenerateMp();
			// this.regenerateTp();
		}
	}

	public regenerateHp(): void {
		let value = Math.floor(this.mhp * this.hrg);
		value = Math.max(value, -this.maxSlipDamage());
		if (value !== 0) {
			this.gainHp(value);
		}
	}

	public regenerateMp(): void {
		const value = Math.floor(this.mmp * this.mrg);
		if (value !== 0) {
			this.gainMp(value);
		}
	}

	// public regenerateTp(): void {
	// 	const value = Math.floor(100 * this.trg);
	// 	this.gainSilentTp(value);
	// }

	public removeAllBuffs(): void {
		for (let i = 0; i < this.buffLength(); i++) {
			this.removeBuff(i);
		}
	}

	public removeBattleStates(): void {
		this.states().forEach((state) => {
			if (state.removeAtBattleEnd) {
				this.removeState(state.id);
			}
		}, this);
	}

	public removeBuff(paramId: Ids.Param): void {
		if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
			this.eraseBuff(paramId);
			this._result.pushRemovedBuff(paramId);
			this.refresh();
		}
	}

	public removeBuffsAuto(): void {
		for (let i = 0; i < this.buffLength(); i++) {
			if (this.isBuffExpired(i)) {
				this.removeBuff(i);
			}
		}
	}

	public removeCurrentAction(): void {
		this._actions.shift();
	}

	public removeState(stateId: RPG.State['id']): void {
		if (this.isStateAffected(stateId)) {
			if (stateId === this.deathStateId()) {
				this.revive();
			}
			this.eraseState(stateId);
			this.refresh();
			this._result.pushRemovedState(stateId);
		}
	}

	public removeStatesAuto(timing: RPG.State.RemovalTiming): void {
		this.states().forEach((state) => {
			if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
				this.removeState(state.id);
			}
		}, this);
	}

	public removeStatesByDamage(): void {
		this.states().forEach((state) => {
			if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
				this.removeState(state.id);
			}
		}, this);
	}

	public requestEffect(effectType: string): void {
		this._effectType = effectType;
	}

	public requestMotion(motionType: string): void {
		this._motionType = motionType;
	}

	public requestMotionRefresh(): void {
		this._motionRefresh = true;
	}

	public result(): ActionResult {
		return this._result;
	}

	public select(): void {
		this._selected = true;
	}

	public setAction(index: number, action: Action): void {
		this._actions[index] = action;
	}

	public setActionState(actionState: Battler.ActionState): void {
		this._actionState = actionState;
		this.requestMotionRefresh();
	}

	// public shouldDelayTpbCharge(): boolean

	public setLastTarget(target: Battler): void {
		if (target) {
			this._lastTargetIndex = target.index();
		} else {
			this._lastTargetIndex = 0;
		}
	}

	public speed(): number {
		return this._speed;
	}

	public startDamagePopup(): void {
		this._damagePopup = true;
	}

	// public startWeaponAnimation(weaponImageId: number): void {
	// 	this._weaponImageId = weaponImageId;
	// }

	// public startTpbTurn(): void

	// public shouldPopupDamage(): boolean

	// public tpbChargeTime(): number

	// public startTpbCasting(): void

	// public startTpbAction(): void

	// public tpbAcceleration(): number

	// public tpbBaseSpeed(): number

	// public tpbRelativeSpeed(): number

	// public tpbSpeed(): number

	// public performMiss(): void {
	// 	SoundManager.playMiss();
	// }

	// public tpbRequiredCastTime(): number

	// public turnCount(): number

	// public updateTpbAutoBattle(): void

	// public updateTpbChargeTime(): void

	// public updateTpbIdleTime(): void

	public useItem(item: RPG.UsableItem): void {
		if (DataManager.isSkill(item)) {
			this.paySkillCost(item);
		} else if (DataManager.isItem(item)) {
			this.consumeItem(item);
		}
	}

	// public updateTpb(): void

	// public updateTpbCastTime(): void
}

export interface Battler {
	_actions: Action[]; // | [Array](Array.md).&lt;[Game_Action](Game_Action.md)&gt; | 行動の配列 |
	_speed: number; // | [Number](Number.md) | 速度(行動順を決定する) |
	_result: ActionResult; // | [Game_ActionResult](Game_ActionResult.md) | 行動の結果 |
	_actionState: Battler.ActionState; // | [String](String.md) | [アクション状態](#アクション状態) |
	_lastTargetIndex: number; // | [Number](Number.md) | 最後の対象番号 |
	_damagePopup: boolean; // | Boolean | ダメージポップアップするか |
	_effectType: string; // | [String](String.md) | エフェクトタイプ |
	_motionType: string; // | [String](String.md) | モーションタイプ |
	_weaponImageId: number; // | [Number](Number.md) | 武器画像ID |
	_motionRefresh: boolean; // | Boolean | モーションを更新するか |
	_selected: boolean; // | Boolean | 選択されているか |
	// _tpbState: Battler.TimeProgressBattleState; // | [String](String.md) | [タイムプログレス戦闘状態](#タイムプログレス戦闘状態) |
	// _tpbChargeTime: number; // | [Number](Number.md) | タイムプログレス戦闘チャージ時間 |
	// _tpbCastTime: number; // | [Number](Number.md) | タイムプログレス戦闘キャスト(詠唱)時間 |
	// _tpbIdleTime: number; // | [Number](Number.md) | タイムプログレス戦闘待機時間 |
	// _tpbTurnCount: number; // | [Number](Number.md) | タイムプログレス戦闘ターンカウント |
	// _tpbTurnEnd: boolean; // | Boolean | タイムプログレス戦闘ターン終了か |
}

export namespace Battler {
	export enum ActionState {
		Undecided,
		Inputting,
		Waiting,
		Acting,
		Done,
		''
	}

	// export enum TimeProgressBattleState {
	// 	Charging,
	// 	Casting,
	// 	Acting,
	// 	Charged,
	// 	Ready
	// }
}
