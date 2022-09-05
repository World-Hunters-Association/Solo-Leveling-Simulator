import type { Ids } from '../Ids';
import type { RPG } from '../RPG';

export class ActionResult {
	public constructor() {
		this.initialize();
	}

	public addedStateObjects(): RPG.State[] {
		return this.addedStates.map((id) => {
			return $dataStates[id];
		});
	}

	public clear(): void {
		this.used = false;
		this.missed = false;
		this.evaded = false;
		this.physical = false;
		this.drain = false;
		this.critical = false;
		this.success = false;
		this.hpAffected = false;
		this.hpDamage = 0;
		this.mpDamage = 0;
		this.tpDamage = 0;
		this.addedStates = [];
		this.removedStates = [];
		this.addedBuffs = [];
		this.addedDebuffs = [];
		this.removedBuffs = [];
	}

	public initialize(): void {
		this.clear();
	}

	public isBuffAdded(paramId: Ids.Param): boolean {
		return this.addedBuffs.contains(paramId);
	}

	public isBuffRemoved(paramId: Ids.Param): boolean {
		return this.removedBuffs.contains(paramId);
	}

	public isDebuffAdded(paramId: Ids.Param): boolean {
		return this.addedDebuffs.contains(paramId);
	}

	public isHit(): boolean {
		return this.used && !this.missed && !this.evaded;
	}

	public isStateAdded(stateId: RPG.State['id']): boolean {
		return this.addedStates.contains(stateId);
	}

	public isStateRemoved(stateId: RPG.State['id']): boolean {
		return this.removedStates.contains(stateId);
	}

	public isStatusAffected(): boolean {
		return (
			this.addedStates.length > 0 ||
			this.removedStates.length > 0 ||
			this.addedBuffs.length > 0 ||
			this.addedDebuffs.length > 0 ||
			this.removedBuffs.length > 0
		);
	}

	public pushAddedBuff(paramId: Ids.Param): void {
		if (!this.isBuffAdded(paramId)) {
			this.addedBuffs.push(paramId);
		}
	}

	public pushAddedDebuff(paramId: Ids.Param): void {
		if (!this.isDebuffAdded(paramId)) {
			this.addedDebuffs.push(paramId);
		}
	}

	public pushAddedState(stateId: RPG.State['id']): void {
		if (!this.isStateAdded(stateId)) {
			this.addedStates.push(stateId);
		}
	}

	public pushRemovedBuff(paramId: Ids.Param): void {
		if (!this.isBuffRemoved(paramId)) {
			this.removedBuffs.push(paramId);
		}
	}

	public pushRemovedState(stateId: RPG.State['id']): void {
		if (!this.isStateRemoved(stateId)) {
			this.removedStates.push(stateId);
		}
	}

	public removedStateObjects(): RPG.State[] {
		return this.removedStates.map((id) => {
			return $dataStates[id];
		});
	}
}

export interface ActionResult {
	/** 使ったか */
	used: boolean;
	/** 失敗か */
	missed: boolean;
	/** [回避]か */
	evaded: boolean;
	/** [物理攻撃]か */
	physical: boolean;
	/** [吸収]か */
	drain: boolean;
	/** [会心]か */
	critical: boolean;
	/** 成功か */
	success: boolean;
	/** HPに変化があったか */
	hpAffected: boolean;
	/** HPのダメージ量 */
	hpDamage: number;
	/** MPのダメージ量 */
	mpDamage: number;
	/** TPのダメージ量 */
	tpDamage: number;
	/** 付加された[ステート]の配列 */
	addedStates: number[];
	/** 削除された[ステート]の配列 */
	removedStates: number[];
	/** 付加された[強化]の配列 */
	addedBuffs: number[];
	/** 付加された[弱体]の配列 */
	addedDebuffs: number[];
	/** 削除された[強化][弱体]の配列 */
	removedBuffs: number[];
}
