/* eslint-disable @typescript-eslint/member-ordering */
import { Codes } from '../Codes';
import { Ids } from '../Ids';
import { RPG } from '../RPG';
import { Item } from './Item';

import type { Types } from '../Types';
import type { Battler } from './Battler';
import type { Unit } from './Unit';

export class Action {
	public constructor(subject: Battler, forcing = false) {
		this.initialize(subject, forcing);
	}

	public initialize(subject: Battler, forcing: boolean): void {
		this._subjectHunterId = 0;
		this._subjectMobIndex = -1;
		this._forcing = forcing || false;
		this.setSubject(subject);
		this.clear();
	}

	public apply(target: Battler): void {
		const result = target.result();
		this.subject().clearResult();
		result.clear();
		result.used = this.testApply(target);
		result.missed = result.used && Math.random() >= this.itemHit(target);
		result.evaded = !result.missed && Math.random() < this.itemEva(target);
		result.physical = this.isPhysical();
		result.drain = this.isDrain();
		if (result.isHit()) {
			if (this.item().damage.type > 0) {
				result.critical = Math.random() < this.itemCri(target);
				const value = this.makeDamageValue(target, result.critical);
				this.executeDamage(target, value);
			}
			this.item().effects.forEach((effect) => {
				this.applyItemEffect(target, effect);
			}, this);
			// this.applyItemUserEffect(target);
		}
	}

	public applyCritical(damage: number): number {
		return damage * 3;
	}

	public applyGlobal(): void {
		this.item().effects.forEach((effect) => {
			if (effect.code === Action.EFFECT_COMMON_EVENT) {
				$gameTemp.reserveCommonEvent(effect.dataId);
			}
		}, this);
	}

	public applyGuard(damage: number, target: Battler): number {
		return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
	}

	public applyItemEffect(target: Battler, effect: RPG.Effect): void {
		switch (effect.code) {
			case Action.EFFECT_RECOVER_HP:
				this.itemEffectRecoverHp(target, effect);
				break;
			case Action.EFFECT_RECOVER_MP:
				this.itemEffectRecoverMp(target, effect);
				break;
			// case Action.EFFECT_GAIN_TP:
			// 	this.itemEffectGainTp(target, effect);
			// 	break;
			case Action.EFFECT_ADD_STATE:
				this.itemEffectAddState(target, effect);
				break;
			case Action.EFFECT_REMOVE_STATE:
				this.itemEffectRemoveState(target, effect);
				break;
			case Action.EFFECT_ADD_BUFF:
				this.itemEffectAddBuff(target, effect);
				break;
			case Action.EFFECT_ADD_DEBUFF:
				this.itemEffectAddDebuff(target, effect);
				break;
			case Action.EFFECT_REMOVE_BUFF:
				this.itemEffectRemoveBuff(target, effect);
				break;
			case Action.EFFECT_REMOVE_DEBUFF:
				this.itemEffectRemoveDebuff(target, effect);
				break;
			case Action.EFFECT_SPECIAL:
				this.itemEffectSpecial(target, effect);
				break;
			case Action.EFFECT_GROW:
				this.itemEffectGrow(target, effect);
				break;
			case Action.EFFECT_LEARN_SKILL:
				this.itemEffectLearnSkill(target, effect);
				break;
			case Action.EFFECT_COMMON_EVENT:
				this.itemEffectCommonEvent(target, effect);
				break;
			default:
		}
	}

	// public applyItemUserEffect(target: Battler): void {
	// 	const value = Math.floor(this.item().tpGain * this.subject().tcr);
	// 	this.subject().gainSilentTp(value);
	// }

	public applyVariance(damage: number, variance: number): number {
		const amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));
		const v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
		return damage >= 0 ? damage + v : damage - v;
	}

	public calcElementRate(target: Battler): number {
		if (this.item().damage.elementId < 0) {
			return this.elementsMaxRate(target, this.subject().attackElements());
		}
		return target.elementRate(this.item().damage.elementId);
	}

	public checkDamageType(list: Ids.Damage[]): boolean {
		return list.contains(this.item().damage.type);
	}

	public checkItemScope(list: RPG.UsableItem.Scope[]): boolean {
		list = RPG.UsableItem.scopesDetail(list);
		return list.contains(this.item().scope);
	}

	public clear(): void {
		this._item = new Item();
		this._targetIndex = -1;
	}

	public confusionTarget(): Battler {
		switch (this.subject().confusionLevel()) {
			case 1:
				return this.opponentsUnit().randomTarget();
			case 2:
				if (Math.randomInt(2) === 0) {
					return this.opponentsUnit().randomTarget();
				}
				return this.friendsUnit().randomTarget();
			default:
				return this.friendsUnit().randomTarget();
		}
	}

	public decideRandomTarget(): void {
		let target;
		if (this.isForDeadAllies()) {
			target = this.friendsUnit().randomDeadTarget();
		} else if (this.isForAllies()) {
			target = this.friendsUnit().randomTarget();
		} else {
			target = this.opponentsUnit().randomTarget();
		}
		if (target) {
			this._targetIndex = target.index();
		} else {
			this.clear();
		}
	}

	public elementsMaxRate(target: Battler, elements: Types.Elements[]): number {
		if (elements.length > 0) {
			return Math.max.apply(
				null,
				elements.map((elementId) => {
					return target.elementRate(elementId);
				}, this)
			);
		}
		return 1;
	}

	public evalDamageFormula(_target: Battler): number {
		// ???
		try {
			const item = this.item();
			// const a = this.subject();
			// const b = target;
			// const v = $gameVariables._data;
			const sign = [3, 4].contains(item.damage.type) ? -1 : 1;
			let value = Math.max(eval(item.damage.formula), 0) * sign;
			if (isNaN(value)) value = 0;
			return value;
		} catch (e) {
			return 0;
		}
	}

	public evaluate(): number {
		let value = 0;
		this.itemTargetCandidates().forEach((target) => {
			const targetValue = this.evaluateWithTarget(target);
			if (this.isForAllBattlers()) {
				value += targetValue;
			} else if (targetValue > value) {
				value = targetValue;
				this._targetIndex = target.index();
			}
		}, this);
		value *= this.numRepeats();
		if (value > 0) {
			value += Math.random();
		}
		return value;
	}

	public evaluateWithTarget(target: Battler): number {
		if (this.isHpEffect()) {
			const value = this.makeDamageValue(target, false);
			if (this.isForOpponent()) {
				return value / Math.max(target.hp, 1);
			}
			const recovery = Math.min(-value, target.mhp - target.hp);
			return recovery / target.mhp;
		}
		return 0;
	}

	public executeDamage(target: Battler, value: number): void {
		const result = target.result();
		if (value === 0) {
			result.critical = false;
		}
		if (this.isHpEffect()) {
			this.executeHpDamage(target, value);
		}
		if (this.isMpEffect()) {
			this.executeMpDamage(target, value);
		}
	}

	public executeHpDamage(target: Battler, value: number): void {
		if (this.isDrain()) {
			value = Math.min(target.hp, value);
		}
		this.makeSuccess(target);
		target.gainHp(-value);
		if (value > 0) {
			target.onDamage(value);
		}
		this.gainDrainedHp(value);
	}

	public executeMpDamage(target: Battler, value: number): void {
		if (!this.isMpRecover()) {
			value = Math.min(target.mp, value);
		}
		if (value !== 0) {
			this.makeSuccess(target);
		}
		target.gainMp(-value);
		this.gainDrainedMp(value);
	}

	public friendsUnit(): Unit {
		return this.subject().friendsUnit();
	}

	public gainDrainedHp(value: number): void {
		if (this.isDrain()) {
			let gainTarget = this.subject();
			if (this._reflectionTarget !== undefined) {
				gainTarget = this._reflectionTarget;
			}
			gainTarget.gainHp(value);
		}
	}

	public gainDrainedMp(value: number): void {
		if (this.isDrain()) {
			let gainTarget = this.subject();
			if (this._reflectionTarget !== undefined) {
				gainTarget = this._reflectionTarget;
			}
			gainTarget.gainMp(value);
		}
	}

	public hasItemAnyValidEffects(target: Battler): boolean {
		return this.item().effects.some((effect) => {
			return this.testItemEffect(target, effect);
		}, this);
	}

	public isAttack(): boolean {
		return this.item() === $dataSkills[this.subject().attackSkillId()];
	}

	public isCertainHit(): boolean {
		return this.item().invocation.hitType === Action.HITTYPE_CERTAIN;
	}

	public isDamage(): boolean {
		return this.checkDamageType([1, 2]);
	}

	public isDrain(): boolean {
		return this.checkDamageType([5, 6]);
	}

	/**
	 * Does not include User
	 */
	public isForAliveAllies(): boolean {
		return this.checkItemScope(['2220']);
	}

	public isForAllBattlers(): boolean {
		return this.checkItemScope(['3020']);
	}

	/**
	 * Includes User
	 */
	public isForAllies(): boolean {
		return this.checkItemScope(['2120', '4000']);
	}

	/**
	 * Does not include User
	 */
	public isForAlliesOnly(): boolean {
		return this.checkItemScope(['2120']);
	}

	/**
	 * Does not include User
	 */
	public isForDeadAllies(): boolean {
		return this.checkItemScope(['2320']);
	}

	public isForOne(): boolean {
		return this.checkItemScope(['1011', '1031', '2111', '2131', '4000']);
	}

	public isForOpponent(): boolean {
		return this.checkItemScope(['1020']);
	}

	public isForRandom(): boolean {
		return this.checkItemScope(['1035', '2134']);
	}

	public isForUser(): boolean {
		return this.checkItemScope(['4000']);
	}

	public isGuard(): boolean {
		return this.item() === $dataSkills[this.subject().guardSkillId()];
	}

	public isHpEffect(): boolean {
		return this.checkDamageType([1, 3, 5]);
	}

	public isHpRecover(): boolean {
		return this.checkDamageType([3]);
	}

	public isItem(): boolean {
		return this._item.isItem();
	}

	public isMagical(): boolean {
		return this.item().invocation.hitType === Action.HITTYPE_MAGICAL;
	}

	public isMagicSkill(): boolean {
		if (this.isSkill()) {
			return $dataSystem.magicSkills.contains((this.item() as RPG.Skill).stypeId);
		}
		return false;
	}

	public isMpEffect(): boolean {
		return this.checkDamageType([2, 4, 6]);
	}

	public isMpRecover(): boolean {
		return this.checkDamageType([4]);
	}

	public isPhysical(): boolean {
		return this.item().invocation.hitType === Action.HITTYPE_PHYSICAL;
	}

	public isRecover(): boolean {
		return this.checkDamageType([3, 4]);
	}

	public isSkill(): boolean {
		return this._item.isSkill();
	}

	public isValid(): boolean {
		return (this._forcing && Boolean(this.item())) || this.subject().canUse(this.item());
	}

	public item(): RPG.UsableItem {
		return this._item.object() as RPG.UsableItem;
	}

	public itemCnt(target: Battler): number {
		if (this.isPhysical() && target.canMove()) {
			return target.cnt;
		}
		return 0;
	}

	public itemCri(target: Battler): number {
		return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
	}

	public itemEffectAddAttackState(target: Battler, effect: RPG.Effect): void {
		this.subject()
			.attackStates()
			.forEach((stateId) => {
				let chance = effect.value1;
				chance *= target.stateRate(stateId);
				chance *= this.subject().attackStatesRate(stateId);
				chance *= this.lukEffectRate(target);
				if (Math.random() < chance) {
					target.addState(stateId);
					this.makeSuccess(target);
				}
			}, target);
	}

	public itemEffectAddBuff(target: Battler, effect: RPG.Effect): void {
		target.addBuff(effect.dataId!, effect.value1);
		this.makeSuccess(target);
	}

	public itemEffectAddDebuff(target: Battler, effect: RPG.Effect): void {
		const chance = target.debuffRate(effect.dataId!) * this.lukEffectRate(target);
		if (Math.random() < chance) {
			target.addDebuff(effect.dataId!, effect.value1);
			this.makeSuccess(target);
		}
	}

	public itemEffectAddNormalState(target: Battler, effect: RPG.Effect): void {
		let chance = effect.value1;
		if (!this.isCertainHit()) {
			chance *= target.stateRate(effect.dataId!);
			chance *= this.lukEffectRate(target);
		}
		if (Math.random() < chance) {
			target.addState(effect.dataId!);
			this.makeSuccess(target);
		}
	}

	public itemEffectAddState(target: Battler, effect: RPG.Effect): void {
		if (effect.dataId === 0) {
			this.itemEffectAddAttackState(target, effect);
		} else {
			this.itemEffectAddNormalState(target, effect);
		}
	}

	public itemEffectCommonEvent(target: Battler, effect: RPG.Effect): void {}

	// public itemEffectGainTp(target: Battler, effect: RPG.Effect): void {
	// 	const value = Math.floor(effect.value1);
	// 	if (value !== 0) {
	// 		target.gainTp(value);
	// 		this.makeSuccess(target);
	// 	}
	// }

	public itemEffectGrow(target: Battler, effect: RPG.Effect): void {
		target.addParam(effect.dataId!, Math.floor(effect.value1));
		this.makeSuccess(target);
	}

	public itemEffectLearnSkill(target: Battler, effect: RPG.Effect): void {
		if (target.isHunter()) {
			target.learnSkill(effect.dataId);
			this.makeSuccess(target);
		}
	}

	public itemEffectRecoverHp(target: Battler, effect: RPG.Effect): void {
		let value = (target.mhp * effect.value1 + effect.value2!) * target.rec;
		if (this.isItem()) {
			value *= this.subject().pha;
		}
		value = Math.floor(value);
		if (value !== 0) {
			target.gainHp(value);
			this.makeSuccess(target);
		}
	}

	public itemEffectRecoverMp(target: Battler, effect: RPG.Effect): void {
		let value = (target.mmp * effect.value1 + effect.value2!) * target.rec;
		if (this.isItem()) {
			value *= this.subject().pha;
		}
		value = Math.floor(value);
		if (value !== 0) {
			target.gainMp(value);
			this.makeSuccess(target);
		}
	}

	public itemEffectRemoveBuff(target: Battler, effect: RPG.Effect): void {
		if (target.isBuffAffected(effect.dataId!)) {
			target.removeBuff(effect.dataId!);
			this.makeSuccess(target);
		}
	}

	public itemEffectRemoveDebuff(target: Battler, effect: RPG.Effect): void {
		if (target.isDebuffAffected(effect.dataId!)) {
			target.removeBuff(effect.dataId!);
			this.makeSuccess(target);
		}
	}

	public itemEffectRemoveState(target: Battler, effect: RPG.Effect): void {
		const chance = effect.value1;
		if (Math.random() < chance) {
			target.removeState(effect.dataId!);
			this.makeSuccess(target);
		}
	}

	public itemEffectSpecial(target: Battler, effect: RPG.Effect): void {
		if (effect.dataId === Action.SPECIAL_EFFECT_ESCAPE) {
			target.escape();
			this.makeSuccess(target);
		}
	}

	public itemEva(target: Battler): number {
		if (this.isPhysical()) {
			return target.eva;
		} else if (this.isMagical()) {
			return target.mev;
		}
		return 0;
	}

	public itemHit(target: Battler): number {
		if (this.isPhysical()) {
			return this.item().invocation.successRate * 0.01 * this.subject().hit;
		}
		return this.item().invocation.successRate * 0.01;
	}

	public itemMrf(target: Battler): number {
		if (this.isMagical()) {
			return target.mrf;
		}
		return 0;
	}

	public itemTargetCandidates(): Battler[] {
		if (!this.isValid()) {
			return [];
		} else if (this.isForOpponent()) {
			return this.opponentsUnit().aliveMembers();
		} else if (this.isForUser()) {
			return [this.subject()];
		} else if (this.isForDeadAllies()) {
			return this.friendsUnit().deadMembers();
		}
		return this.friendsUnit().aliveMembers();
	}

	public lukEffectRate(target: Battler): number {
		return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
	}

	public makeDamageValue(target: Battler, critical: boolean): number {
		const item = this.item();
		const baseValue = this.evalDamageFormula(target);
		let value = baseValue * this.calcElementRate(target);
		if (this.isPhysical()) {
			value *= target.pdr;
		}
		if (this.isMagical()) {
			value *= target.mdr;
		}
		if (baseValue < 0) {
			value *= target.rec;
		}
		if (critical) {
			value = this.applyCritical(value);
		}
		value = this.applyVariance(value, item.damage.variance);
		value = this.applyGuard(value, target);
		value = Math.round(value);
		return value;
	}

	public makeSuccess(target: Battler): void {
		target.result().success = true;
	}

	public makeTargets(): Battler[] {
		let targets: Battler[] = [];
		if (!this._forcing && this.subject().isConfused()) {
			targets = [this.confusionTarget()];
		} else if (this.isForOpponent()) {
			targets = this.targetsForOpponents();
		} else if (this.isForAllies()) {
			targets = this.targetsForFriends();
		}
		return this.repeatTargets(targets);
	}

	public needsSelection(): boolean {
		return this.checkItemScope(['1015', '2114']);
	}

	public numRepeats(): number {
		let { repeats } = this.item().invocation;
		if (this.isAttack()) {
			repeats += this.subject().attackTimesAdd();
		}
		return Math.floor(repeats);
	}

	public numTargets(): number {
		return this.isForRandom()
			? this.item()
					.scope.split('')
					.map((s, i, a) => (i === 3 ? Number(a.slice(3).join('')) : Number(s)))[3]
			: 0;
	}

	public opponentsUnit(): Unit {
		return this.subject().opponentsUnit();
	}

	public prepare(): void {
		if (this.subject().isConfused() && !this._forcing) {
			this.setConfusion();
		}
	}

	public repeatTargets(targets: Battler[]): Battler[] {
		const repeatedTargets = [];
		const repeats = this.numRepeats();
		for (const target of targets) {
			if (target) {
				for (let j = 0; j < repeats; j++) {
					repeatedTargets.push(target);
				}
			}
		}
		return repeatedTargets;
	}

	public setAttack(): void {
		this.setSkill(this.subject().attackSkillId());
	}

	public setConfusion(): void {
		this.setAttack();
	}

	public setMobAction(action: RPG.Mob.Action): void {
		if (action) {
			this.setSkill(action.skillId);
		} else {
			this.clear();
		}
	}

	public setGuard(): void {
		this.setSkill(this.subject().guardSkillId());
	}

	public setItem(itemId: RPG.UsableItem['id']): void {
		this._item.setObject($dataItems[itemId]);
	}

	public setItemObject(object: RPG.UsableItem): void {
		this._item.setObject(object);
	}

	public setSkill(skillId: RPG.Skill['id']): void {
		this._item.setObject($dataSkills[skillId]);
	}

	public setSubject(subject: Battler): void {
		if (subject.isHunter()) {
			this._subjectHunterId = subject.hunterId();
			this._subjectMobIndex = -1;
		} else {
			this._subjectMobIndex = subject.index();
			this._subjectHunterId = 0;
		}
	}

	public setTarget(targetIndex: number): void {
		this._targetIndex = targetIndex;
	}

	public speed(): number {
		const { agi } = this.subject();
		let speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
		if (this.item()) {
			speed += this.item().invocation.speed;
		}
		if (this.isAttack()) {
			speed += this.subject().attackSpeed();
		}
		return speed;
	}

	public subject(): Battler {
		if (this._subjectHunterId > 0) {
			return $gameHunters.hunter(this._subjectHunterId);
		}
		return $gameTroop.members()[this._subjectMobIndex];
	}

	// public targetsForAlive(unit: Unit): Battler[]

	// public targetsForDead(unit: Unit): Battler[]

	// public targetsForDeadAndAlive(unit: Unit): Battler[]

	// public targetsForEveryone(): Battler[]

	public targetsForFriends(): Battler[] {
		let targets = [];
		const unit = this.friendsUnit();
		if (this.isForUser()) {
			return [this.subject()];
		} else if (this.isForDeadAllies()) {
			if (this.isForOne()) {
				targets.push(unit.smoothDeadTarget(this._targetIndex));
			} else {
				targets = unit.deadMembers();
			}
		} else if (this.isForOne()) {
			if (this._targetIndex < 0) {
				targets.push(unit.randomTarget());
			} else {
				targets.push(unit.smoothTarget(this._targetIndex));
			}
		} else {
			targets = unit.aliveMembers();
		}
		return targets;
	}

	public targetsForOpponents(): Battler[] {
		let targets = [];
		const unit = this.opponentsUnit();
		if (this.isForRandom()) {
			for (let i = 0; i < this.numTargets(); i++) {
				targets.push(unit.randomTarget());
			}
		} else if (this.isForOne()) {
			if (this._targetIndex < 0) {
				targets.push(unit.randomTarget());
			} else {
				targets.push(unit.smoothTarget(this._targetIndex));
			}
		} else {
			targets = unit.aliveMembers();
		}
		return targets;
	}

	public testApply(target: Battler): boolean {
		return (
			this.isForDeadAllies() === target.isDead() &&
			($gameParty.inBattle() ||
				this.isForOpponent() ||
				(this.isHpRecover() && target.hp < target.mhp) ||
				(this.isMpRecover() && target.mp < target.mmp) ||
				this.hasItemAnyValidEffects(target))
		);
	}

	// public testLifeAndDeath(target: Battler): boolean

	public testItemEffect(target: Battler, effect: RPG.Effect): boolean {
		switch (effect.code) {
			case Action.EFFECT_RECOVER_HP:
				return target.hp < target.mhp || effect.value1 < 0 || effect.value2! < 0;
			case Action.EFFECT_RECOVER_MP:
				return target.mp < target.mmp || effect.value1 < 0 || effect.value2! < 0;
			case Action.EFFECT_ADD_STATE:
				return !target.isStateAffected(effect.dataId!);
			case Action.EFFECT_REMOVE_STATE:
				return target.isStateAffected(effect.dataId!);
			case Action.EFFECT_ADD_BUFF:
				return !target.isMaxBuffAffected(effect.dataId!);
			case Action.EFFECT_ADD_DEBUFF:
				return !target.isMaxDebuffAffected(effect.dataId!);
			case Action.EFFECT_REMOVE_BUFF:
				return target.isBuffAffected(effect.dataId!);
			case Action.EFFECT_REMOVE_DEBUFF:
				return target.isDebuffAffected(effect.dataId!);
			case Action.EFFECT_LEARN_SKILL:
				return target.isHunter() && !target.isLearnedSkill(effect.dataId!);
			default:
				return true;
		}
	}

	// public updateLastSubject(): void

	// public updateLastUsed(): void

	// public updateLastTarget(target: Battler): void

	public static EFFECT_RECOVER_HP = Codes.Effect['EFFECT_RECOVER_HP']; // [static] HP回復
	public static EFFECT_RECOVER_MP = Codes.Effect['EFFECT_RECOVER_MP']; // [static] MP回復
	public static EFFECT_ADD_STATE = Codes.Effect['EFFECT_ADD_STATE']; // [static] ステート付加
	public static EFFECT_REMOVE_STATE = Codes.Effect['EFFECT_REMOVE_STATE']; // [static] ステート解除
	public static EFFECT_ADD_BUFF = Codes.Effect['EFFECT_ADD_BUFF']; // [static] 強化
	public static EFFECT_ADD_DEBUFF = Codes.Effect['EFFECT_ADD_DEBUFF']; // [static] 弱体
	public static EFFECT_REMOVE_BUFF = Codes.Effect['EFFECT_REMOVE_BUFF']; // [static] 強化の解除
	public static EFFECT_REMOVE_DEBUFF = Codes.Effect['EFFECT_REMOVE_DEBUFF']; // [static] 弱体の解除
	public static EFFECT_SPECIAL = Codes.Effect['EFFECT_SPECIAL']; // [static] 特殊効果
	public static EFFECT_GROW = Codes.Effect['EFFECT_GROW']; // [static] 成長
	public static EFFECT_LEARN_SKILL = Codes.Effect['EFFECT_LEARN_SKILL']; // [static] スキル習得
	public static EFFECT_COMMON_EVENT = Codes.Effect['EFFECT_COMMON_EVENT']; // [static] コモンイベント
	public static SPECIAL_EFFECT_ESCAPE = Ids.SpecialEffect.SPECIAL_EFFECT_ESCAPE; // [static] 特殊効果 - 逃げる
	public static HITTYPE_CERTAIN = RPG.UsableItem.HitType.HITTYPE_CERTAIN; // [static] 必中
	public static HITTYPE_PHYSICAL = RPG.UsableItem.HitType.HITTYPE_PHYSICAL; // [static] 物理攻撃
	public static HITTYPE_MAGICAL = RPG.UsableItem.HitType.HITTYPE_MAGICAL; // [static] 魔法攻撃
}

export interface Action {
	_subjectHunterId: number;
	_subjectMobIndex: number;
	_targetIndex: number;
	_forcing: boolean;
	_item: Item;
}
