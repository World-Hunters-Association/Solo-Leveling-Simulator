import { DataManager } from 'discord.js';

import { Unit } from './Unit';

import type { RPG } from '../RPG';
import type { Hunter } from './Hunter';
import { Item } from './Item';

export class Party extends Unit {
	public addHunter(hunterId: RPG.Hunter['id']) {
		if (!this._hunters.contains(hunterId)) {
			this._hunters.push(hunterId);
			$gamePlayer.refresh();
			$gameMap.requestRefresh();
		}
	}

	// public allBattleMembers(): Hunter[]

	public allItems(): RPG.BaseItem[] {
		return (this.items() as RPG.BaseItem[]).concat(this.equipItems());
	}

	public allMembers(): Hunter[] {
		return this._hunters.map((id) => {
			return $gameHunters.hunter(id);
		});
	}

	public armors(): RPG.Armor[] {
		const list = [];
		for (const id in this._armors) {
			if (Object.hasOwn(this._armors, id)) list.push($dataArmors[id]);
		}
		return list;
	}

	public battleMembers(): Hunter[] {
		return this.allMembers()
			.slice(0, this.maxBattleMembers())
			.filter((hunter) => {
				return hunter.isAppeared();
			});
	}

	public canInput(): boolean {
		return this.members().some((hunter) => {
			return hunter.canInput();
		});
	}

	public canUse(item: RPG.UsableItem): boolean {
		return this.members().some((hunter) => {
			return hunter.canUse(item);
		});
	}

	public charactersForSavefile(): any[][] {
		return this.battleMembers().map((hunter) => {
			return [hunter.characterName(), hunter.characterIndex()];
		});
	}

	public consumeItem(item: RPG.BaseItem) {
		if (DataManager.isItem(item) && (item as RPG.Item).consumable) {
			this.loseItem(item, 1);
		}
	}

	public discardMembersEquip(item: RPG.EquipItem, amount: number) {
		let n = amount;
		this.members().forEach((hunter) => {
			while (n > 0 && hunter.isEquipped(item)) {
				hunter.discardEquip(item);
				n--;
			}
		});
	}

	public equipItems(): RPG.EquipItem[] {
		return (this.weapons() as RPG.EquipItem[]).concat(this.armors());
	}

	public exists(): boolean {
		return this._hunters.length > 0;
	}

	public facesForSavefile(): any[][] {
		return this.battleMembers().map((hunter) => {
			return [hunter.faceName(), hunter.faceIndex()];
		});
	}

	public gainGold(amount: number) {
		this._gold = (this._gold + amount).clamp(0, this.maxGold());
	}

	public gainItem(item: RPG.BaseItem, amount: number, includeEquip = false) {
		const container = this.itemContainer(item);
		if (container) {
			const lastNumber = this.numItems(item);
			const newNumber = lastNumber + amount;
			container[item.id] = newNumber.clamp(0, this.maxItems(item));
			if (container[item.id] === 0) {
				delete container[item.id];
			}
			if (includeEquip && newNumber < 0) {
				this.discardMembersEquip(item as RPG.EquipItem, -newNumber);
			}
			$gameMap.requestRefresh();
		}
	}

	public gold(): number {
		return this._gold;
	}

	// public hasCancelSurprise(): boolean {
	// 	return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
	// }

	// public hasDropItemDouble(): boolean {
	// 	return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
	// }

	// public hasEncounterHalf(): boolean {
	// 	return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
	// }

	// public hasEncounterNone(): boolean {
	// 	return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
	// }

	// public hasGoldDouble(): boolean {
	// 	return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
	// }

	public hasItem(item: RPG.BaseItem, includeEquip = false): boolean {
		if (includeEquip === undefined) {
			includeEquip = false;
		}
		if (this.numItems(item) > 0) {
			return true;
		} else if (includeEquip && this.isAnyMemberEquipped(item as RPG.EquipItem)) {
			return true;
		}
		return false;
	}

	public hasMaxItems(item: RPG.BaseItem): boolean {
		return this.numItems(item) >= this.maxItems(item);
	}

	// public hasRaisePreemptive(): boolean {
	// 	return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
	// }

	// public hiddenBattleMembers(): Hunter[]

	public highestLevel(): number {
		return Math.max.apply(
			null,
			this.members().map((hunter) => {
				return hunter.level;
			})
		);
	}

	public increaseSteps() {
		this._steps++;
	}

	public initAllItems() {
		this._items = {};
		this._weapons = {};
		this._armors = {};
	}

	public initialize() {
		super.initialize();
		this._gold = 0;
		this._steps = 0;
		this._lastItem = new Item();
		this._menuHunterId = 0;
		this._targetHunterId = 0;
		this._hunters = [];
		this.initAllItems();
	}

	public isAllDead(): boolean {
		if (super.isAllDead()) {
			return this.inBattle() || !this.isEmpty();
		}
		return false;
	}

	public isAnyMemberEquipped(item: RPG.EquipItem): boolean {
		return this.members().some((hunter) => {
			return hunter.equips().contains(item);
		});
	}

	public isEmpty(): boolean {
		return this.size() === 0;
	}

	// public isEscaped(): boolean

	public itemContainer(item: RPG.BaseItem): Record<number, number> | null {
		if (!item) {
			return null;
		} else if (DataManager.isItem(item)) {
			return this._items;
		} else if (DataManager.isWeapon(item)) {
			return this._weapons;
		} else if (DataManager.isArmor(item)) {
			return this._armors;
		}
		return null;
	}

	public items(): RPG.Item[] {
		const list = [];
		for (const id in this._items) {
			if (Object.hasOwn(this._items, id)) list.push($dataItems[id]);
		}
		return list;
	}

	public lastItem(): RPG.BaseItem | undefined {
		return this._lastItem.object();
	}

	public leader(): Hunter {
		return this.battleMembers()[0];
	}

	public loseGold(amount: number) {
		this.gainGold(-amount);
	}

	public loseItem(item: RPG.BaseItem, amount: number, includeEquip = false) {
		this.gainItem(item, -amount, includeEquip);
	}

	public makeMenuHunterNext() {
		let index = this.members().indexOf(this.menuHunter());
		if (index >= 0) {
			index = (index + 1) % this.members().length;
			this.setMenuHunter(this.members()[index]);
		} else {
			this.setMenuHunter(this.members()[0]);
		}
	}

	public makeMenuHunterPrevious() {
		let index = this.members().indexOf(this.menuHunter());
		if (index >= 0) {
			index = (index + this.members().length - 1) % this.members().length;
			this.setMenuHunter(this.members()[index]);
		} else {
			this.setMenuHunter(this.members()[0]);
		}
	}

	public maxBattleMembers(): number {
		return 4;
	}

	public maxGold(): number {
		return Infinity;
	}

	public maxItems(item: RPG.BaseItem): number {
		return Infinity;
	}

	public members(): Hunter[] {
		return this.inBattle() ? this.battleMembers() : this.allMembers();
	}

	public menuHunter(): Hunter {
		let hunter = $gameHunters.hunter(this._menuHunterId);
		if (!this.members().contains(hunter)) {
			[hunter] = this.members();
		}
		return hunter;
	}

	public name(): string {
		const numBattleMembers = this.battleMembers().length;
		if (numBattleMembers === 0) {
			return '';
		} else if (numBattleMembers === 1) {
			return this.leader().name();
		}
		return TextManager.partyName.format(this.leader().name());
	}

	public numItems(item: RPG.BaseItem): number {
		const container = this.itemContainer(item);
		return container ? container[item.id] || 0 : 0;
	}

	// public onEscapeFailure()

	public onPlayerWalk() {
		this.members().forEach((hunter) => {
			return hunter.onPlayerWalk();
		});
	}

	// public partyAbility(abilityId: number): boolean {
	// 	return this.battleMembers().some((hunter) => {
	// 		return hunter.partyAbility(abilityId);
	// 	});
	// }

	public performEscape() {
		this.members().forEach((hunter) => {
			hunter.performEscape();
		});
	}

	public performVictory() {
		this.members().forEach((hunter) => {
			hunter.performVictory();
		});
	}

	public ratePreemptive(troopAgi: number): number {
		const rate = this.agility() >= troopAgi ? 0.05 : 0.03;
		// if (this.hasRaisePreemptive()) {
		// 	rate *= 4;
		// }
		return rate;
	}

	public rateSurprise(troopAgi: number): number {
		const rate = this.agility() >= troopAgi ? 0.03 : 0.05;
		// if (this.hasCancelSurprise()) {
		// 	rate = 0;
		// }
		return rate;
	}

	public removeHunter(hunterId: RPG.Hunter['id']) {
		if (this._hunters.contains(hunterId)) {
			this._hunters.splice(this._hunters.indexOf(hunterId), 1);
			$gamePlayer.refresh();
			$gameMap.requestRefresh();
		}
	}

	public removeBattleStates() {
		this.members().forEach((hunter) => {
			hunter.removeBattleStates();
		});
	}

	// public removeInvalidMembers()

	public requestMotionRefresh() {
		this.members().forEach((hunter) => {
			hunter.requestMotionRefresh();
		});
	}

	public reviveBattleMembers() {
		this.battleMembers().forEach((hunter) => {
			if (hunter.isDead()) {
				hunter.setHp(1);
			}
		});
	}

	public setLastItem(item: RPG.BaseItem) {
		this._lastItem.setObject(item);
	}

	public setMenuHunter(hunter: Hunter) {
		this._menuHunterId = hunter.hunterId();
	}

	public setTargetHunter(hunter: Hunter) {
		this._targetHunterId = hunter.hunterId();
	}

	public setupBattleTest() {
		this.setupBattleTestMembers();
		this.setupBattleTestItems();
	}

	public setupBattleTestItems() {
		$dataItems.forEach((item) => {
			if (item && item.name.length > 0) {
				this.gainItem(item, this.maxItems(item));
			}
		}, this);
	}

	public setupBattleTestMembers() {
		$dataSystem.testBattlers.forEach((battler) => {
			const hunter = $gameHunters.hunter(battler.hunterId);
			if (hunter) {
				hunter.changeLevel(battler.level, false);
				hunter.initEquips(battler.equips);
				hunter.recoverAll();
				this.addHunter(battler.hunterId);
			}
		}, this);
	}

	public setupStartingMembers() {
		this._hunters = [];
		$dataSystem.partyMembers.forEach((hunterId) => {
			if ($gameHunters.hunter(hunterId)) {
				this._hunters.push(hunterId);
			}
		}, this);
	}

	public size(): number {
		return this.members().length;
	}

	public steps(): number {
		return this._steps;
	}

	public swapOrder(index1: number, index2: number) {
		const temp = this._hunters[index1];
		this._hunters[index1] = this._hunters[index2];
		this._hunters[index2] = temp;
		$gamePlayer.refresh();
	}

	public targetHunter(): Hunter {
		let hunter = $gameHunters.hunter(this._targetHunterId);
		if (!this.members().contains(hunter)) {
			[hunter] = this.members();
		}
		return hunter;
	}

	public weapons(): RPG.Weapon[] {
		const list = [];
		for (const id in this._weapons) {
			if (Object.hasOwn(this._weapons, id)) list.push($dataWeapons[id]);
		}
		return list;
	}
}

export interface Party {
	_gold: number;
	_steps: number;
	_lastItem: Item;
	_menuHunterId: number;
	_targetHunterId: number;
	_hunters: RPG.Hunter['id'][];
	_items: Record<number, number>;
	_weapons: Record<number, number>;
	_armors: Record<number, number>;
}
