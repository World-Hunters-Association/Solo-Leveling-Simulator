import { Codes } from '../Codes';
import { Ids } from '../Ids';

import type { RPG } from '../RPG';
import type { Types } from '../Types';

export abstract class BattlerBase {
	public constructor() {
		this.initialize();
	}

	/** Hit Points */
	public get hp() {
		return this._hp;
	}

	/** Mana Points */
	public get mp() {
		return this._mp;
	}

	/** Maximum Hit Points */
	public get mhp() {
		return this.param(Ids.Param.mhp);
	}

	/** Maximum Mana Points */
	public get mmp() {
		return this.param(Ids.Param.mmp);
	}

	/** STRength */
	public get str() {
		return this.param(Ids.Param.str);
	}

	/** DEFense power */
	public get def() {
		return this.param(Ids.Param.def);
	}

	/** INTelligence */
	public get int() {
		return this.param(Ids.Param.int);
	}

	/** Magic Resistance */
	public get mr() {
		return this.param(Ids.Param.mr);
	}

	/** AGIlity */
	public get agi() {
		return this.param(Ids.Param.agi);
	}

	/** LUcK */
	public get luk() {
		return this.param(Ids.Param.luk);
	}

	/** HIT rate */
	public get hit() {
		return this.xparam(Ids.ExtraParam.hit);
	}

	/** EVAsion rate */
	public get eva() {
		return this.xparam(Ids.ExtraParam.eva);
	}

	/** CRItical rate */
	public get cri() {
		return this.xparam(Ids.ExtraParam.cri);
	}

	/** Critical EVasion rate */
	public get cev() {
		return this.xparam(Ids.ExtraParam.cev);
	}

	/** Magic EVasion rate */
	public get mev() {
		return this.xparam(Ids.ExtraParam.mev);
	}

	/** Magic ReFlection rate */
	public get mrf() {
		return this.xparam(Ids.ExtraParam.mrf);
	}

	/** CouNTer attack rate */
	public get cnt() {
		return this.xparam(Ids.ExtraParam.cnt);
	}

	/** Hp ReGeneration rate */
	public get hrg() {
		return this.xparam(Ids.ExtraParam.hrg);
	}

	/** Mp ReGeneration rate */
	public get mrg() {
		return this.xparam(Ids.ExtraParam.mrg);
	}

	/** TarGet Rate */
	public get tgr() {
		return this.sparam(Ids.SpecialParam.tgr);
	}

	/** GuaRD effect rate */
	public get grd() {
		return this.sparam(Ids.SpecialParam.grd);
	}

	/** RECovery effect rate */
	public get rec() {
		return this.sparam(Ids.SpecialParam.rec);
	}

	/** PHArmacology */
	public get pha() {
		return this.sparam(Ids.SpecialParam.pha);
	}

	/** Mp Cost Rate */
	public get mcr() {
		return this.sparam(Ids.SpecialParam.mcr);
	}

	/** Physical Damage Rate */
	public get pdr() {
		return this.sparam(Ids.SpecialParam.pdr);
	}

	/** Magical Damage Rate */
	public get mdr() {
		return this.sparam(Ids.SpecialParam.mdr);
	}

	/** Floor Damage Rate */
	public get fdr() {
		return this.sparam(Ids.SpecialParam.fdr);
	}

	/** EXperience Rate */
	public get exr() {
		return this.sparam(Ids.SpecialParam.exr);
	}

	public actionPlusSet(): number[] {
		return this.traits(BattlerBase.TRAIT_ACTION_PLUS).map((trait) => {
			return trait.value;
		});
	}

	public addedSkills(): number[] {
		return this.traitsSet(BattlerBase.TRAIT_SKILL_ADD);
	}

	public addedSkillTypes(): number[] {
		return this.traitsSet(BattlerBase.TRAIT_STYPE_ADD);
	}

	public addNewState(stateId: RPG.State['id']): void {
		if (stateId === this.deathStateId()) {
			this.die();
		}
		// const restricted = this.isRestricted(); // ???
		this._states.push(stateId);
		this.sortStates();
		// if (!restricted && this.isRestricted()) { // ???
		// 	this.onRestrict();
		// }
	}

	public addParam(paramId: Ids.Param, value: number): void {
		this._paramPlus[paramId] += value;
		this.refresh();
	}

	// public allIcons(): number[] {
	// 	return this.stateIcons().concat(this.buffIcons());
	// }

	public allTraits(): RPG.Trait[] {
		return this.traitObjects().reduce<RPG.Trait[]>((r, obj) => {
			return r.concat(obj.traits);
		}, []);
	}

	public appear(): void {
		this._hidden = false;
	}

	public attackElements(): number[] {
		return this.traitsSet(BattlerBase.TRAIT_ATTACK_ELEMENT);
	}

	public attackSkillId(): number {
		return 1;
	}

	public attackSpeed(): number {
		return this.traitsSumAll(BattlerBase.TRAIT_ATTACK_SPEED);
	}

	public attackStates(): number[] {
		return this.traitsSet(BattlerBase.TRAIT_ATTACK_STATE);
	}

	public attackStatesRate(stateId: RPG.State['id']): number {
		return this.traitsSum(BattlerBase.TRAIT_ATTACK_STATE, stateId);
	}

	public attackTimesAdd(): number {
		return Math.max(this.traitsSumAll(BattlerBase.TRAIT_ATTACK_TIMES), 0);
	}

	public buff(paramId: Ids.Param): number {
		return this._buffs[paramId];
	}

	public buffIconIndex(buffLevel: number, paramId: Ids.Param): number {
		if (buffLevel > 0) {
			return BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
		} else if (buffLevel < 0) {
			return BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
		}
		return 0;
	}

	public buffIcons(): number[] {
		const icons = [];
		for (let i = 0; i < this._buffs.length; i++) {
			if (this._buffs[i] !== 0) {
				icons.push(this.buffIconIndex(this._buffs[i], i));
			}
		}
		return icons;
	}

	public buffLength(): number {
		return this._buffs.length;
	}

	public canAttack(): boolean {
		return this.canUse($dataSkills[this.attackSkillId()]);
	}

	public canEquip(item: RPG.EquipItem): boolean {
		if (!item) {
			return false;
		} else if (DataManager.isWeapon(item)) {
			return this.canEquipWeapon(item);
		} else if (DataManager.isArmor(item)) {
			return this.canEquipArmor(item);
		}
		return false;
	}

	public canEquipArmor(item: RPG.EquipItem): boolean {
		return this.isEquipAtypeOk((item as RPG.Armor).atypeId) && !this.isEquipTypeSealed(item.etypeId);
	}

	public canEquipWeapon(item: RPG.EquipItem): boolean {
		return this.isEquipWtypeOk((item as RPG.Weapon).wtypeId) && !this.isEquipTypeSealed(item.etypeId);
	}

	public canGuard(): boolean {
		return this.canUse($dataSkills[this.guardSkillId()]);
	}

	public canInput(): boolean {
		return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
	}

	public canMove(): boolean {
		return this.isAppeared() && this.restriction() < 4;
	}

	public canPaySkillCost(skill: RPG.Skill): boolean {
		// return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
		return this._mp >= this.skillMpCost(skill);
	}

	public canUse(item: RPG.UsableItem): boolean {
		if (!item) {
			return false;
		} else if (DataManager.isSkill(item)) {
			return this.meetsSkillConditions(item as RPG.Skill);
		} else if (DataManager.isItem(item)) {
			return this.meetsItemConditions(item as RPG.Item);
		}
		return false;
	}

	public clearBuffs(): void {
		this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
		this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
	}

	public clearParamPlus(): void {
		this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
	}

	public clearStates(): void {
		this._states = [];
		this._stateTurns = {};
	}

	// public collapseType(): number {
	// 	const set = this.traitsSet(BattlerBase.TRAIT_COLLAPSE_TYPE);
	// 	return set.length > 0 ? Math.max.apply(null, set) : 0;
	// }

	public confusionLevel(): number {
		return this.isConfused() ? this.restriction() : 0;
	}

	public deathStateId(): number {
		return 1;
	}

	public debuffRate(paramId: Ids.Param): number {
		return this.traitsPi(BattlerBase.TRAIT_DEBUFF_RATE, paramId);
	}

	public decreaseBuff(paramId: Ids.Param): void {
		if (!this.isMaxDebuffAffected(paramId)) {
			this._buffs[paramId]--;
		}
	}

	public die(): void {
		this._hp = 0;
		this.clearStates();
		this.clearBuffs();
	}

	public elementRate(elementId: Types.Elements): number {
		return this.traitsPi(BattlerBase.TRAIT_ELEMENT_RATE, elementId);
	}

	public eraseBuff(paramId: Ids.Param): void {
		this._buffs[paramId] = 0;
		this._buffTurns[paramId] = 0;
	}

	public eraseState(stateId: RPG.State['id']): void {
		const index = this._states.indexOf(stateId);
		if (index >= 0) {
			this._states.splice(index, 1);
		}
		delete this._stateTurns[stateId];
	}

	public guardSkillId(): number {
		return 2;
	}

	public hide(): void {
		this._hidden = true;
	}

	public hpRate(): number {
		return this.hp / this.mhp;
	}

	public increaseBuff(paramId: Ids.Param): void {
		if (!this.isMaxBuffAffected(paramId)) {
			this._buffs[paramId]++;
		}
	}

	public abstract initialize(..._: any): void;

	public initMembers(): void {
		this._hp = 1;
		this._mp = 0;
		// this._tp = 0;
		this._hidden = false;
		this.clearParamPlus();
		this.clearStates();
		this.clearBuffs();
	}

	public isHunter(): boolean {
		return false;
	}

	public isAlive(): boolean {
		return this.isAppeared() && !this.isDeathStateAffected();
	}

	public isAppeared(): boolean {
		return !this.isHidden();
	}

	public isAutoBattle(): boolean {
		return this.specialFlag(BattlerBase.FLAG_ID_AUTO_BATTLE);
	}

	public isBuffAffected(paramId: Ids.Param): boolean {
		return this._buffs[paramId] > 0;
	}

	public isBuffExpired(paramId: Ids.Param): boolean {
		return this._buffTurns[paramId] === 0;
	}

	public isBuffOrDebuffAffected(paramId: Ids.Param): boolean {
		return this._buffs[paramId] !== 0;
	}

	public isConfused(): boolean {
		return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
	}

	public isDead(): boolean {
		return this.isAppeared() && this.isDeathStateAffected();
	}

	public isDeathStateAffected(): boolean {
		return this.isStateAffected(this.deathStateId());
	}

	public isDebuffAffected(paramId: Ids.Param): boolean {
		return this._buffs[paramId] < 0;
	}

	public isDualWield(): boolean {
		return this.slotType() === 1;
	}

	public isDying(): boolean {
		return this.isAlive() && this._hp < this.mhp / 4;
	}

	public isMob(): boolean {
		return false;
	}

	public isEquipAtypeOk(atypeId: Types.Armor): boolean {
		return this.traitsSet(BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
	}

	public isEquipTypeLocked(etypeId: Types.Equipment): boolean {
		return this.traitsSet(BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
	}

	public isEquipTypeSealed(etypeId: Types.Equipment): boolean {
		return this.traitsSet(BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
	}

	public isEquipWtypeOk(wtypeId: Types.Weapon): boolean {
		return this.traitsSet(BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
	}

	public isGuard(): boolean {
		return this.specialFlag(BattlerBase.FLAG_ID_GUARD) && this.canMove();
	}

	public isHidden(): boolean {
		return this._hidden;
	}

	public isMaxBuffAffected(paramId: Ids.Param): boolean {
		return this._buffs[paramId] === 2;
	}

	public isMaxDebuffAffected(paramId: Ids.Param): boolean {
		return this._buffs[paramId] === -2;
	}

	public isOccasionOk(item: RPG.UsableItem): boolean {
		if ($gameParty.inBattle()) {
			return item.occasion === 0 || item.occasion === 1;
		}
		return item.occasion === 0 || item.occasion === 2;
	}

	public isPreserveTp(): boolean {
		return this.specialFlag(BattlerBase.FLAG_ID_PRESERVE_TP);
	}

	public isRestricted(): boolean {
		return this.isAppeared() && this.restriction() > 0;
	}

	public isSkillSealed(skillId: RPG.Skill['id']): boolean {
		return this.traitsSet(BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
	}

	public isSkillTypeSealed(stypeId: Types.Skill): boolean {
		return this.traitsSet(BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
	}

	public isSkillWtypeOk(_skill: RPG.Skill): boolean {
		return true;
	}

	public isStateAffected(stateId: RPG.State['id']): boolean {
		return this._states.contains(stateId);
	}

	public isStateExpired(stateId: RPG.State['id']): boolean {
		return this._stateTurns[stateId] === 0;
	}

	public isStateResist(stateId: RPG.State['id']): boolean {
		return this.stateResistSet().contains(stateId);
	}

	public isSubstitute(): boolean {
		return this.specialFlag(BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
	}

	public maxTp(): number {
		return 100;
	}

	public meetsItemConditions(item: RPG.Item): boolean {
		return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
	}

	public meetsSkillConditions(skill: RPG.Skill): boolean {
		return (
			this.meetsUsableItemConditions(skill) &&
			this.isSkillWtypeOk(skill) &&
			this.canPaySkillCost(skill) &&
			!this.isSkillSealed(skill.id) &&
			!this.isSkillTypeSealed(skill.stypeId)
		);
	}

	public meetsUsableItemConditions(item: RPG.UsableItem): boolean {
		return this.canMove() && this.isOccasionOk(item);
	}

	// public mostImportantStateText(): string {
	// 	const states = this.states();
	// 	for (const i of states) {
	// 		if (states.message3) {
	// 			return states.message3;
	// 		}
	// 	}
	// 	return '';
	// }

	public mpRate(): number {
		return this.mmp > 0 ? this.mp / this.mmp : 0;
	}

	// public onRestrict(): void {} // ???

	public overwriteBuffTurns(paramId: Ids.Param, turns: number): void {
		if (this._buffTurns[paramId] < turns) {
			this._buffTurns[paramId] = turns;
		}
	}

	public param(paramId: Ids.Param): number {
		let value = this.paramBasePlus(paramId);
		value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
		const maxValue = this.paramMax(paramId);
		const minValue = this.paramMin(paramId);
		return Math.round(value.clamp(minValue, maxValue));
	}

	public paramBase(_paramId: Ids.Param): number {
		return 0;
	}

	public paramBasePlus(paramId: Ids.Param): number {
		return this.paramBase(paramId) + this.paramPlus(paramId);
	}

	public paramBuffRate(paramId: Ids.Param): number {
		return this._buffs[paramId] * 0.25 + 1.0;
	}

	public paramMax(paramId: Ids.Param): number {
		if (paramId === 0) {
			return 999999; // MHP
		} else if (paramId === 1) {
			return 9999; // MMP
		}
		return 999;
	}

	public paramMin(paramId: Ids.Param): number {
		if (paramId === 1) {
			return 0; // MMP
		}
		return 1;
	}

	public paramPlus(paramId: Ids.Param): number {
		return this._paramPlus[paramId];
	}

	public paramRate(paramId: Ids.Param): number {
		return this.traitsPi(BattlerBase.TRAIT_PARAM, paramId);
	}

	// public partyAbility(abilityId: number): boolean {
	// 	return this.traits(BattlerBase.TRAIT_PARTY_ABILITY).some((trait) => {
	// 		return trait.dataId === abilityId;
	// 	});
	// }

	public paySkillCost(skill: RPG.Skill): void {
		this._mp -= this.skillMpCost(skill);
		// this._tp -= this.skillTpCost(skill);
	}

	public recoverAll(): void {
		this.clearStates();
		this._hp = this.mhp;
		this._mp = this.mmp;
	}

	public refresh(): void {
		this.stateResistSet().forEach((stateId) => {
			this.eraseState(stateId);
		}, this);
		this._hp = this._hp.clamp(0, this.mhp);
		this._mp = this._mp.clamp(0, this.mmp);
		// this._tp = this._tp.clamp(0, this.maxTp());
	}

	public resetStateCounts(stateId: RPG.State['id']): void {
		const state = $dataStates[stateId];
		const variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
		this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
	}

	public restriction(): number {
		return Math.max.apply(
			null,
			this.states()
				.map((state) => state.restriction)
				.concat(0)
		);
	}

	public revive(): void {
		if (this._hp === 0) {
			this._hp = 1;
		}
	}

	public setHp(hp: number): void {
		this._hp = hp;
		this.refresh();
	}

	public setMp(mp: number): void {
		this._mp = mp;
		this.refresh();
	}

	// public setTp(tp: number): void {
	// 	this._tp = tp;
	// 	this.refresh();
	// }

	public skillMpCost(skill: RPG.Skill): number {
		return Math.floor(skill.mpCost * this.mcr);
	}

	// public skillTpCost(skill: RPG.Skill): number {
	// 	return skill.tpCost;
	// }

	public slotType(): number {
		const set = this.traitsSet(BattlerBase.TRAIT_SLOT_TYPE);
		return set.length > 0 ? Math.max.apply(null, set) : 0;
	}

	public sortStates(): void {
		this._states.sort((a, b) => {
			const p1 = $dataStates[a].priority;
			const p2 = $dataStates[b].priority;
			if (p1 !== p2) {
				return p2 - p1;
			}
			return a - b;
		});
	}

	public sparam(sparamId: Ids.SpecialParam): number {
		return this.traitsPi(BattlerBase.TRAIT_SPARAM, sparamId);
	}

	public specialFlag(flagId: Ids.SpecialFlag): boolean {
		return this.traits(BattlerBase.TRAIT_SPECIAL_FLAG).some((trait) => {
			return trait.dataId === flagId;
		});
	}

	// public stateIcons(): number[] {
	// 	return this.states()
	// 		.map((state) => {
	// 			return state.iconIndex;
	// 		})
	// 		.filter((iconIndex) => {
	// 			return iconIndex > 0;
	// 		});
	// }

	// public stateMotionIndex(): number {
	// 	const states = this.states();
	// 	if (states.length > 0) {
	// 		return states[0].motion;
	// 	}
	// 	return 0;
	// }

	// public stateOverlayIndex(): number {
	// 	const states = this.states();
	// 	if (states.length > 0) {
	// 		return states[0].overlay;
	// 	}
	// 	return 0;
	// }

	public stateRate(stateId: RPG.State['id']): number {
		return this.traitsPi(BattlerBase.TRAIT_STATE_RATE, stateId);
	}

	public stateResistSet(): number[] {
		return this.traitsSet(BattlerBase.TRAIT_STATE_RESIST);
	}

	public states(): RPG.State[] {
		return this._states.map((id) => {
			return $dataStates[id];
		});
	}

	// public tpRate(): number {
	// 	return this.tp / this.maxTp();
	// }

	public traitObjects(): Record<'traits', RPG.Trait[]>[] {
		// Returns an array of the all objects having traits. States only here.
		return this.states().map((state) => ({ traits: state.traits }));
	}

	public traits(code: RPG.Trait['code']): RPG.Trait[] {
		return this.allTraits().filter((trait) => {
			return trait.code === code;
		});
	}

	public traitsPi(code: RPG.Trait['code'], id: RPG.Trait['dataId']): number {
		return this.traitsWithId(code, id).reduce((r, trait) => {
			return r * trait.value;
		}, 1);
	}

	public traitsSet(code: RPG.Trait['code']): number[] {
		return this.traits(code).reduce<number[]>((r, trait) => {
			return r.concat(trait.dataId);
		}, []);
	}

	public traitsSum(code: RPG.Trait['code'], id: RPG.Trait['dataId']): number {
		return this.traitsWithId(code, id).reduce((r, trait) => {
			return r + trait.value;
		}, 0);
	}

	public traitsSumAll(code: RPG.Trait['code']): number {
		return this.traits(code).reduce((r, trait) => {
			return r + trait.value;
		}, 0);
	}

	public traitsWithId(code: RPG.Trait['code'], id: RPG.Trait['dataId']): RPG.Trait[] {
		return this.allTraits().filter((trait) => {
			return trait.code === code && trait.dataId === id;
		});
	}

	public updateBuffTurns(): void {
		for (let i = 0; i < this._buffTurns.length; i++) {
			if (this._buffTurns[i] > 0) {
				this._buffTurns[i]--;
			}
		}
	}

	public updateStateTurns(): void {
		this._states.forEach((stateId) => {
			if (this._stateTurns[stateId] > 0) {
				this._stateTurns[stateId]--;
			}
		}, this);
	}

	public xparam(xparamId: Ids.ExtraParam): number {
		return this.traitsSum(BattlerBase.TRAIT_XPARAM, xparamId);
	}

	public static TRAIT_DEBUFF_RATE = Codes.Trait['TRAIT_DEBUFF_RATE']; // [static] [resistance]-[weakening effectiveness]
	public static TRAIT_ELEMENT_RATE = Codes.Trait['TRAIT_ELEMENT_RATE']; // [static] [resistance]-[attribute effectiveness]
	public static TRAIT_STATE_RATE = Codes.Trait['TRAIT_STATE_RATE']; // [static] [resistance]-[state effectiveness]
	public static TRAIT_STATE_RESIST = Codes.Trait['TRAIT_STATE_RESIST']; // [static] [resistance]-[state invalidation]
	public static TRAIT_PARAM = Codes.Trait['TRAIT_PARAM']; // [static] [ability score]-[normal ability score]
	public static TRAIT_XPARAM = Codes.Trait['TRAIT_XPARAM']; // [static] [stats]-[additional stats]
	public static TRAIT_SPARAM = Codes.Trait['TRAIT_SPARAM']; // [static] [ability score]-[special ability score]
	public static TRAIT_ATTACK_ELEMENT = Codes.Trait['TRAIT_ATTACK_ELEMENT']; // [static] [attack]-[attribute when attacking]
	public static TRAIT_ATTACK_STATE = Codes.Trait['TRAIT_ATTACK_STATE']; // [static] [attack]-[attack state]
	public static TRAIT_ATTACK_SPEED = Codes.Trait['TRAIT_ATTACK_SPEED']; // [static] [attack]-[attack speed modifier]
	public static TRAIT_ATTACK_TIMES = Codes.Trait['TRAIT_ATTACK_TIMES']; // [static] [Attack]-[Number of additional attacks]
	public static TRAIT_ATTACK_SKILL = Codes.Trait['TRAIT_ATTACK_SKILL']; // @MZ [static] [attack]-[attack skill]
	public static TRAIT_STYPE_ADD = Codes.Trait['TRAIT_STYPE_ADD']; // [static] [skill]-[add skill type]
	public static TRAIT_STYPE_SEAL = Codes.Trait['TRAIT_STYPE_SEAL']; // [static] [skill]-[skill type seal]
	public static TRAIT_SKILL_ADD = Codes.Trait['TRAIT_SKILL_ADD']; // [static] [skill]-[add skill]
	public static TRAIT_SKILL_SEAL = Codes.Trait['TRAIT_SKILL_SEAL']; // [static] [skill]-[skill seal]
	public static TRAIT_EQUIP_WTYPE = Codes.Trait['TRAIT_EQUIP_WTYPE']; // [static] [equipment]-[weapon type equipment]
	public static TRAIT_EQUIP_ATYPE = Codes.Trait['TRAIT_EQUIP_ATYPE']; // [static] [equipment]-[armor type equipment]
	public static TRAIT_EQUIP_LOCK = Codes.Trait['TRAIT_EQUIP_LOCK']; // [static] [equipment]-[fixed equipment]
	public static TRAIT_EQUIP_SEAL = Codes.Trait['TRAIT_EQUIP_SEAL']; // [static] [equipment]-[equipment seal]
	public static TRAIT_SLOT_TYPE = Codes.Trait['TRAIT_SLOT_TYPE']; // [static] [equipment]-[slot type]
	public static TRAIT_ACTION_PLUS = Codes.Trait['TRAIT_ACTION_PLUS']; // [static] [Others]-[Add actions]
	public static TRAIT_SPECIAL_FLAG = Codes.Trait['TRAIT_SPECIAL_FLAG']; // [static] [other]-[special flags]
	// public static TRAIT_COLLAPSE_TYPE = Codes.Trait['TRAIT_COLLAPSE_TYPE']; // [static] [other]-[annihilation effect]
	// public static TRAIT_PARTY_ABILITY = Codes.Trait['TRAIT_PARTY_ABILITY']; // [static] [other]-[party ability]
	public static FLAG_ID_AUTO_BATTLE: number; // [static] Special Flag ID [Auto Combat]
	public static FLAG_ID_GUARD: number; // [static] [Defense] of special flag ID
	public static FLAG_ID_SUBSTITUTE: number; // [static] [scapegoat] of special flag ID
	public static FLAG_ID_PRESERVE_TP: number; // [static] [TP carryover] of special flag ID
	public static ICON_BUFF_START: number; // [static] Start position of ability enhancement icon
	public static ICON_DEBUFF_START: number; // [static] Start position of ability debuff iconhp	Number	[read-only] HP
}

export interface BattlerBase {
	_hp: number;
	_mp: number;
	_hidden: boolean; //	Boolean	隠れているか
	_paramPlus: number[]; //	Array.<Number>	能力値強化量の配列
	_states: number[]; //	Array.<Number>	ステートID の配列
	_stateTurns: { [stateId: RPG.State['id']]: number }; //	Object	{[stateId: RPG.State['id']]: number} ステートの残りターン
	_buffs: number[]; //	Array.<Number>	能力の強化の配列
	_buffTurns: number[]; //	Array.<Number>	強化の残りターン
}
