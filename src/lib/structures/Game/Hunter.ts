import { DataManager, Snowflake } from 'discord.js';

import { Battler } from './Battler';
import { Item } from './Item';

import type { RPG } from '../RPG';
import { Types } from '../Types';
import { Action } from './Action';
import type { Ids } from '../Ids';
import { container } from '@sapphire/framework';
import type { Party } from './Party';

export class Hunter extends Battler {
	public constructor() {
		super();
	}

	public hunter(): Promise<RPG.Hunter> {
		return container.db.collection('hunter').findOne({ id: this._hunterId }) as Promise<RPG.Hunter>;
	}

	public hunterId(): Snowflake {
		return this._hunterId;
	}

	public friendsUnit(): Party {
		return this._party;
	}

	public armors(): RPG.Armor[] {
		return (this.equips() as RPG.Armor[]).filter((item) => {
			return item && DataManager.isArmor(item);
		});
	}

	// public attackAnimationId1(): number {
	// 	if (this.hasNoWeapons()) {
	// 		return this.bareHandsAnimationId();
	// 	}
	// 	const weapons = this.weapons();
	// 	return weapons[0] ? weapons[0].animationId : 0;
	// }

	// public attackAnimationId2(): number {
	// 	const weapons = this.weapons();
	// 	return weapons[1] ? weapons[1].animationId : 0;
	// }

	public attackElements(): number[] {
		const set = super.attackElements();
		if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
			set.push(this.bareHandsElementId());
		}
		return set;
	}

	public bareHandsAnimationId(): number {
		return 1;
	}

	public bareHandsElementId(): number {
		return 1;
	}

	public basicFloorDamage(): number {
		return 10;
	}

	public battlerName(): string {
		return this._battlerName;
	}

	public benchMembersExpRate(): number {
		return $dataSystem.optExtraExp ? 1 : 0;
	}

	public bestEquipItem(slotId: number): RPG.EquipItem | null {
		const etypeId = this.equipSlots()[slotId];
		const items = this._party.equipItems().filter((item) => {
			return item.etypeId === etypeId && this.canEquip(item);
		}, this);
		let bestItem = null;
		let bestPerformance = -1000;
		for (const item of items) {
			const performance = this.calcEquipItemPerformance(item);
			if (performance > bestPerformance) {
				bestPerformance = performance;
				bestItem = item;
			}
		}
		return bestItem;
	}

	public calcEquipItemPerformance(item: RPG.EquipItem): number {
		return item.params.reduce((a, b) => {
			return a + b;
		});
	}

	// public changeClass(classId: RPG.Class, keepExp: boolean): void {
	// 	if (keepExp) {
	// 		this._exp[classId] = this.currentExp();
	// 	}
	// 	this._classId = classId;
	// 	this.changeExp(this._exp[this._classId] || 0, false);
	// 	this.refresh();
	// }

	public changeEquip(slotId: number, item: RPG.EquipItem): void {
		if (this.tradeItemWithParty(item, this.equips()[slotId]) && (!item || this.equipSlots()[slotId] === item.etypeId)) {
			this._equips[slotId].setObject(item);
			this.refresh();
		}
	}

	public changeEquipById(etypeId: Types.Equipment, itemId: RPG.EquipItem['id']): void {
		const slotId = etypeId - 1;
		if (this.equipSlots()[slotId] === 1) {
			this.changeEquip(slotId, $dataWeapons[itemId]);
		} else {
			this.changeEquip(slotId, $dataArmors[itemId]);
		}
	}

	public changeExp(exp: number, show: boolean): void {
		this._exp[this._classId] = Math.max(exp, 0);
		const lastLevel = this._level;
		const lastSkills = this.skills();
		while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
			this.levelUp();
		}
		while (this.currentExp() < this.currentLevelExp()) {
			this.levelDown();
		}
		if (show && this._level > lastLevel) {
			this.displayLevelUp(this.findNewSkills(lastSkills));
		}
		this.refresh();
	}

	public changeLevel(level: number, show: boolean): void {
		level = level.clamp(1, this.maxLevel());
		this.changeExp(this.expForLevel(level), show);
	}

	public characterIndex(): number {
		return this._characterIndex;
	}

	public characterName(): string {
		return this._characterName;
	}

	public checkFloorEffect(): void {
		if ($gamePlayer.isOnDamageFloor()) {
			this.executeFloorDamage();
		}
	}

	public clearActions(): void {
		super.clearActions();
		this._actionInputIndex = 0;
	}

	public clearEquipments(): void {
		const maxSlots = this.equipSlots().length;
		for (let i = 0; i < maxSlots; i++) {
			if (this.isEquipChangeOk(i)) {
				this.changeEquip(i, null);
			}
		}
	}

	public clearStates(): void {
		super.clearStates();
		this._stateSteps = {};
	}

	public currentClass(): RPG.Class {
		return $dataClasses[this._classId];
	}

	public currentExp(): number {
		return this._exp[this._classId];
	}

	public currentLevelExp(): number {
		return this.expForLevel(this._level);
	}

	public discardEquip(item: RPG.EquipItem): void {
		const slotId = this.equips().indexOf(item);
		if (slotId >= 0) {
			this._equips[slotId].setObject(null);
		}
	}

	public displayLevelUp(newSkills: RPG.Skill[]): void {
		const text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
		$gameMessage.newPage();
		$gameMessage.add(text);
		newSkills.forEach(function (skill) {
			$gameMessage.add(TextManager.obtainSkill.format(skill.name));
		});
	}

	public equips(): RPG.EquipItem[] {
		return this._equips.map((item) => {
			return item.object() as RPG.EquipItem;
		});
	}

	public equipSlots(): number[] {
		const slots = [];
		for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
			slots.push(i);
		}
		if (slots.length >= 2 && this.isDualWield()) {
			slots[1] = 1;
		}
		return slots;
	}

	public eraseState(stateId: RPG.State['id']): void {
		super.eraseState(stateId);
		delete this._stateSteps[stateId];
	}

	public executeFloorDamage(): void {
		let damage = Math.floor(this.basicFloorDamage() * this.fdr);
		damage = Math.min(damage, this.maxFloorDamage());
		this.gainHp(-damage);
		if (damage > 0) {
			this.performMapDamage();
		}
	}

	public expForLevel(level: number): number {
		const c = this.currentClass();
		const basis = c.expParams[0];
		const extra = c.expParams[1];
		const acc_a = c.expParams[2];
		const acc_b = c.expParams[3];
		return Math.round(
			(basis * Math.pow(level - 1, 0.9 + acc_a / 250) * level * (level + 1)) / (6 + Math.pow(level, 2) / 50 / acc_b) + (level - 1) * extra
		);
	}

	public faceIndex(): number {
		return this._faceIndex;
	}

	public faceName(): string {
		return this._faceName;
	}

	public finalExpRate(): number {
		return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
	}

	public findNewSkills(lastSkills: RPG.Skill[]): RPG.Skill[] {
		const newSkills = this.skills();
		for (const lastSkill of lastSkills) {
			const index = newSkills.indexOf(lastSkill);
			if (index >= 0) {
				newSkills.splice(index, 1);
			}
		}
		return newSkills;
	}

	public forceChangeEquip(slotId: number, item: RPG.EquipItem): void {
		this._equips[slotId].setObject(item);
		this.releaseUnequippableItems(true);
		this.refresh();
	}

	public forgetSkill(skillId: RPG.Skill['id']): void {
		const index = this._skills.indexOf(skillId);
		if (index >= 0) {
			this._skills.splice(index, 1);
		}
	}

	public gainExp(exp: number): void {
		const newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
		this.changeExp(newExp, this.shouldDisplayLevelUp());
	}

	public hasArmor(armor: RPG.Armor): boolean {
		return this.armors().contains(armor);
	}

	public hasNoWeapons(): boolean {
		return this.weapons().length === 0;
	}

	public hasSkill(skillId: RPG.Skill['id']): boolean {
		return this.skills().contains($dataSkills[skillId]);
	}

	public hasWeapon(weapon: RPG.Weapon): boolean {
		return this.weapons().contains(weapon);
	}

	public hide(): void {
		super.hide();
	}

	public index(): number {
		return $gameParty.members().indexOf(this);
	}

	public initEquips(equips: number[]): void {
		const slots = this.equipSlots();
		const maxSlots = slots.length;
		this._equips = [];
		for (let i = 0; i < maxSlots; i++) {
			this._equips[i] = new Item();
		}
		for (let j = 0; j < equips.length; j++) {
			if (j < maxSlots) {
				this._equips[j].setEquip(slots[j] === 1, equips[j]);
			}
		}
		this.releaseUnequippableItems(true);
		this.refresh();
	}

	public initExp(): void {
		this._exp[this._classId] = this.currentLevelExp();
	}

	public initialize(hunterId: number): void {
		this.initMembers();
		this.setup(hunterId);
	}

	public initImages(): void {
		const hunter = this.hunter();
		this._characterName = hunter.characterName;
		this._characterIndex = hunter.characterIndex;
		this._faceName = hunter.faceName;
		this._faceIndex = hunter.faceIndex;
		this._battlerName = hunter.battlerName;
	}

	public initMembers(): void {
		super.initMembers();
		this._hunterId = 0;
		this._name = '';
		this._nickname = '';
		this._classId = 0;
		this._level = 0;
		this._characterName = '';
		this._characterIndex = 0;
		this._faceName = '';
		this._faceIndex = 0;
		this._battlerName = '';
		this._exp = {};
		this._skills = [];
		this._equips = [];
		this._actionInputIndex = 0;
		this._lastMenuSkill = new Item();
		this._lastBattleSkill = new Item();
		this._lastCommandSymbol = '';
	}

	public initSkills(): void {
		this._skills = [];
		this.currentClass().learnings.forEach((learning) => {
			if (learning.level <= this._level) {
				this.learnSkill(learning.skillId);
			}
		}, this);
	}

	public inputtingAction(): Action {
		return this.action(this._actionInputIndex);
	}

	public isHunter(): boolean {
		return true;
	}

	public isBattleMember(): boolean {
		return $gameParty.battleMembers().contains(this);
	}

	public isClass(gameClass: RPG.Class): boolean {
		return gameClass && this._classId === gameClass.id;
	}

	public isEquipChangeOk(slotId: number): boolean {
		return !this.isEquipTypeLocked(this.equipSlots()[slotId]) && !this.isEquipTypeSealed(this.equipSlots()[slotId]);
	}

	public isEquipped(item: RPG.EquipItem): boolean {
		return this.equips().contains(item);
	}

	public isFormationChangeOk(): boolean {
		return true;
	}

	public isLearnedSkill(skillId: RPG.Skill['id']): boolean {
		return this._skills.contains(skillId);
	}

	public isMaxLevel(): boolean {
		return this._level >= this.maxLevel();
	}

	public isSkillWtypeOk(skill: RPG.Skill): boolean {
		const wtypeIds = skill.requiredWTypeIds;
		if (!wtypeIds?.length || wtypeIds.every((id) => id === Types.Weapon.none) || wtypeIds.some((id) => this.isWtypeEquipped(id))) {
			return true;
		}
		return false;
	}

	public isSpriteVisible(): boolean {
		return $gameSystem.isSideView();
	}

	public isWtypeEquipped(wtypeId: RPG.Weapon['id']): boolean {
		return this.weapons().some((weapon) => {
			return weapon.wtypeId === wtypeId;
		});
	}

	public lastSkill(): RPG.Skill {
		return this.skills().at(-1)!;
	}

	public lastBattleSkill(): RPG.Skill {
		return this._lastBattleSkill.object() as RPG.Skill;
	}

	public lastCommandSymbol(): string {
		return this._lastCommandSymbol;
	}

	public lastMenuSkill(): RPG.Skill {
		return this._lastMenuSkill.object() as RPG.Skill;
	}

	public learnSkill(skillId: RPG.Skill['id']): void {
		if (!this.isLearnedSkill(skillId)) {
			this._skills.push(skillId);
			this._skills.sort((a, b) => a - b);
		}
	}

	public levelDown(): void {
		this._level--;
	}

	public levelUp(): void {
		this._level++;
		this.currentClass().learnings.forEach((learning) => {
			if (learning.level === this._level) {
				this.learnSkill(learning.skillId);
			}
		}, this);
	}

	public makeActionList(): Action[] {
		const list = [];
		let action = new Action(this);
		action.setAttack();
		list.push(action);
		this.usableSkills().forEach((skill) => {
			action = new Action(this);
			action.setSkill(skill.id);
			list.push(action);
		}, this);
		return list;
	}

	public makeActions(): void {
		super.makeActions();
		if (this.numActions() > 0) {
			this.setActionState(Battler.ActionState.Undecided);
		} else {
			this.setActionState(Battler.ActionState.Waiting);
		}
		if (this.isAutoBattle()) {
			this.makeAutoBattleActions();
		} else if (this.isConfused()) {
			this.makeConfusionActions();
		}
	}

	public makeAutoBattleActions(): void {
		for (let i = 0; i < this.numActions(); i++) {
			const list = this.makeActionList();
			let maxValue = Number.MIN_VALUE;
			for (const action of list) {
				const value = action.evaluate();
				if (value > maxValue) {
					maxValue = value;
					this.setAction(i, action);
				}
			}
		}
		this.setActionState(Battler.ActionState.Waiting);
	}

	public makeConfusionActions(): void {
		for (let i = 0; i < this.numActions(); i++) {
			this.action(i).setConfusion();
		}
		this.setActionState(Battler.ActionState.Waiting);
	}

	public maxFloorDamage(): number {
		return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
	}

	public maxLevel(): number {
		return this.hunter().maxLevel;
	}

	public meetsUsableItemConditions(item: RPG.UsableItem): boolean {
		if ($gameParty.inBattle() && !BattleManager.canEscape() && this.testEscape(item)) {
			return false;
		}
		return super.meetsUsableItemConditions(item);
	}

	public name(): string {
		return this._name;
	}

	public nextLevelExp(): number {
		return this.expForLevel(this._level + 1);
	}

	public nextRequiredExp(): number {
		return this.nextLevelExp() - this.currentExp();
	}

	public nickname(): string {
		return this._nickname;
	}

	public onPlayerWalk(): void {
		super.clearResult();
		this.checkFloorEffect();
		if ($gamePlayer.isNormal()) {
			this.turnEndOnMap();
			this.states().forEach((state) => this.updateStateSteps(state), this);
			this.showAddedStates();
			this.showRemovedStates();
		}
	}

	// public onEscapeFailure(): void

	public opponentsUnit(): Troop {
		return $gameTroop;
	}

	public optimizeEquipments(): void {
		const maxSlots = this.equipSlots().length;
		this.clearEquipments();
		for (let i = 0; i < maxSlots; i++) {
			if (this.isEquipChangeOk(i)) {
				this.changeEquip(i, this.bestEquipItem(i));
			}
		}
	}

	public paramBase(paramId: Ids.Param): number {
		return this.currentClass().params[paramId][this._level];
	}

	public paramPlus(paramId: Ids.Param): number {
		let value = super.paramPlus(paramId);
		const equips = this.equips();
		for (const item of equips) {
			if (item) {
				value += item.params[paramId];
			}
		}
		return value;
	}

	// public performAction(action: Action): void {
	// 	super.performAction(action);
	// 	if (action.isAttack()) {
	// 		this.performAttack();
	// 	} else if (action.isGuard()) {
	// 		this.requestMotion('guard');
	// 	} else if (action.isMagicSkill()) {
	// 		this.requestMotion('spell');
	// 	} else if (action.isSkill()) {
	// 		this.requestMotion('skill');
	// 	} else if (action.isItem()) {
	// 		this.requestMotion('item');
	// 	}
	// }

	public performActionEnd(): void {
		super.performActionEnd();
	}

	public performActionStart(action: Action): void {
		super.performActionStart(action);
	}

	// public performAttack(): void {
	// 	const weapons = this.weapons();
	// 	const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
	// 	const attackMotion = $dataSystem.attackMotions[wtypeId];
	// 	if (attackMotion) {
	// 		if (attackMotion.type === 0) {
	// 			this.requestMotion('thrust');
	// 		} else if (attackMotion.type === 1) {
	// 			this.requestMotion('swing');
	// 		} else if (attackMotion.type === 2) {
	// 			this.requestMotion('missile');
	// 		}
	// 		this.startWeaponAnimation(attackMotion.weaponImageId);
	// 	}
	// }

	// public performCollapse(): void {
	// 	super.performCollapse();
	// 	if ($gameParty.inBattle()) {
	// 		SoundManager.playHunterCollapse();
	// 	}
	// }

	// public performCounter(): void {
	// 	super.performCounter();
	// 	this.performAttack();
	// }

	// public performDamage(): void {
	// 	super.performDamage();
	// 	if (this.isSpriteVisible()) {
	// 		this.requestMotion('damage');
	// 	} else {
	// 		$gameScreen.startShake(5, 5, 10);
	// 	}
	// 	SoundManager.playHunterDamage();
	// }

	public performEscape(): void {
		if (this.canMove()) {
			this.requestMotion('escape');
		}
	}

	// public performEvasion(): void {
	// 	super.performEvasion();
	// 	this.requestMotion('evade');
	// }

	// public performMagicEvasion(): void {
	// 	super.performMagicEvasion();
	// 	this.requestMotion('evade');
	// }

	// public performMapDamage(): void {
	// 	if (!$gameParty.inBattle()) {
	// 		$gameScreen.startFlashForDamage();
	// 	}
	// }

	public performVictory(): void {
		if (this.canMove()) {
			this.requestMotion('victory');
		}
	}

	public profile(): string {
		return this._profile;
	}

	public refresh(): void {
		this.releaseUnequippableItems(false);
		super.refresh();
	}

	public releaseUnequippableItems(forcing: boolean): void {
		for (;;) {
			const slots = this.equipSlots();
			const equips = this.equips();
			let changed = false;
			for (let i = 0; i < equips.length; i++) {
				const item = equips[i];
				if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
					if (!forcing) {
						this.tradeItemWithParty(null, item);
					}
					this._equips[i].setObject(null);
					changed = true;
				}
			}
			if (!changed) {
				break;
			}
		}
	}

	public resetStateCounts(stateId: RPG.State['id']): void {
		super.resetStateCounts(stateId);
		this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
	}

	public selectNextCommand(): boolean {
		if (this._actionInputIndex < this.numActions() - 1) {
			this._actionInputIndex++;
			return true;
		}
		return false;
	}

	public selectPreviousCommand(): boolean {
		if (this._actionInputIndex > 0) {
			this._actionInputIndex--;
			return true;
		}
		return false;
	}

	public setBattlerImage(battlerName: string): void {
		this._battlerName = battlerName;
	}

	public setCharacterImage(characterName: string, characterIndex: number): void {
		this._characterName = characterName;
		this._characterIndex = characterIndex;
	}

	public setFaceImage(faceName: string, faceIndex: number): void {
		this._faceName = faceName;
		this._faceIndex = faceIndex;
	}

	public setLastBattleSkill(skill: RPG.Skill): void {
		this._lastBattleSkill.setObject(skill);
	}

	public setLastCommandSymbol(symbol: string): void {
		this._lastCommandSymbol = symbol;
	}

	public setLastMenuSkill(skill: RPG.Skill): void {
		this._lastMenuSkill.setObject(skill);
	}

	public setName(name: string): void {
		this._name = name;
	}

	public setNickname(nickname: string): void {
		this._nickname = nickname;
	}

	public setProfile(profile: string): void {
		this._profile = profile;
	}

	public setup(hunterId: number): void {
		const hunter = $dataHunters[hunterId];
		this._hunterId = hunterId;
		this._name = hunter.name;
		this._nickname = hunter.nickname;
		this._profile = hunter.profile;
		this._classId = hunter.classId;
		this._level = hunter.initialLevel;
		this.initImages();
		this.initExp();
		this.initSkills();
		this.initEquips(hunter.equips);
		this.clearParamPlus();
		this.recoverAll();
	}

	public shouldDisplayLevelUp(): boolean {
		return true;
	}

	public showAddedStates(): void {
		this.result()
			.addedStateObjects()
			.forEach((state) => {
				if (state.message1) {
					$gameMessage.add(this._name + state.message1);
				}
			}, this);
	}

	public showRemovedStates(): void {
		this.result()
			.removedStateObjects()
			.forEach((state) => {
				if (state.message4) {
					$gameMessage.add(this._name + state.message4);
				}
			}, this);
	}

	public skills(): RPG.Skill[] {
		const list: RPG.Skill[] = [];
		this._skills.concat(this.addedSkills()).forEach((id) => {
			if (!list.contains($dataSkills[id])) {
				list.push($dataSkills[id]);
			}
		});
		return list;
	}

	// public skillTypes(): RPG.Skill[]

	public stepsForTurn(): number {
		return 20;
	}

	public testEscape(item: RPG.UsableItem): boolean {
		return item.effects.some((effect) => {
			return effect && effect.code === Action.EFFECT_SPECIAL;
		});
	}

	public tradeItemWithParty(newItem: RPG.EquipItem | null, oldItem: RPG.EquipItem | null): boolean {
		if (newItem && !$gameParty.hasItem(newItem)) {
			return false;
		}
		$gameParty.gainItem(oldItem, 1);
		$gameParty.loseItem(newItem, 1);
		return true;
	}

	public traitObjects(): Record<'traits', RPG.Trait[]>[] {
		let objects = super.traitObjects();
		objects = objects.concat([this.hunter(), this.currentClass()]);
		const equips = this.equips();
		for (const item of equips) {
			if (item) {
				objects.push(item);
			}
		}
		return objects;
	}

	public turnEndOnMap(): void {
		if ($gameParty.steps() % this.stepsForTurn() === 0) {
			this.onTurnEnd();
			// if (this.result().hpDamage > 0) {
			// 	this.performMapDamage();
			// }
		}
	}

	public updateStateSteps(state: RPG.State): void {
		if (state.removalCondition.walking) {
			if (this._stateSteps[state.id] > 0) {
				if (--this._stateSteps[state.id] === 0) {
					this.removeState(state.id);
				}
			}
		}
	}

	public usableSkills(): RPG.Skill[] {
		return this.skills().filter((skill) => this.canUse(skill), this);
	}

	public weapons(): RPG.Weapon[] {
		return this.equips().filter((item) => item && DataManager.isWeapon(item)) as RPG.Weapon[];
	}
}

export interface Hunter {
	level: number;
	_hunterId: Snowflake;
	_name: string;
	_nickname: string;
	_profile: string;
	_classId: number;
	_level: number;
	_characterName: string;
	_characterIndex: number;
	_faceName: string;
	_faceIndex: number;
	_battlerName: string;
	_exp: Record<RPG.Class['id'], number>;
	_skills: number[];
	_equips: Item[];
	_actionInputIndex: number;
	_lastMenuSkill: Item;
	_lastBattleSkill: Item;
	_lastCommandSymbol: string;
	_stateSteps: Record<RPG.State['id'], number>;
	_party: Party;
}
